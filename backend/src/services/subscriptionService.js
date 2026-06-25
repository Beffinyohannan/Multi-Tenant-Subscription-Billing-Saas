import sequelize, { Subscription } from "../models/index.js";
import { AppError } from "../middleware/errorHandler.js";

export async function assignPlan(tenantId, { userId, planId }) {
  const user = await sequelize.query(
    "SELECT id, tenant_id, role FROM users WHERE id = $1",
    { bind: [userId], type: sequelize.QueryTypes.SELECT, plain: true }
  );
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.tenant_id !== tenantId) {
    throw new AppError("User does not belong to this tenant", 403);
  }
  if (user.role === "ADMIN") {
    throw new AppError("Cannot assign a plan to an admin user", 403);
  }

  const plan = await sequelize.query(
    "SELECT id, tenant_id, billing_interval FROM plans WHERE id = $1",
    { bind: [planId], type: sequelize.QueryTypes.SELECT, plain: true }
  );
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }
  if (plan.tenant_id !== tenantId) {
    throw new AppError("Plan does not belong to this tenant", 403);
  }

  const existing = await sequelize.query(
    "SELECT id FROM subscriptions WHERE user_id = $1 AND plan_id = $2 AND status = 'ACTIVE'",
    { bind: [userId, planId], type: sequelize.QueryTypes.SELECT, plain: true }
  );
  if (existing) {
    throw new AppError("User already has an active subscription for this plan", 409);
  }

  const intervalMap = { weekly: "7 days", monthly: "1 month", yearly: "1 year" };
  const interval = intervalMap[plan.billing_interval];

  const result = await sequelize.query(
    `INSERT INTO subscriptions (tenant_id, user_id, plan_id, end_date)
     VALUES ($1, $2, $3, NOW() + $4::interval)
     RETURNING *`,
    { bind: [tenantId, userId, planId, interval], type: sequelize.QueryTypes.SELECT, plain: true }
  );

  return result;
}

export async function findSubscriptionsByTenant(tenantId, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const countResult = await sequelize.query(
    `SELECT COUNT(*)::int AS count FROM subscriptions WHERE tenant_id = $1`,
    { bind: [tenantId], type: sequelize.QueryTypes.SELECT, plain: true }
  );

  const rows = await sequelize.query(
    `SELECT s.*, u.name AS user_name, u.email AS user_email,
            p.name AS plan_name, p.price, p.billing_interval
     FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     JOIN plans p ON p.id = s.plan_id
     WHERE s.tenant_id = $1
     ORDER BY s.created_at DESC
     LIMIT $2 OFFSET $3`,
    { bind: [tenantId, limit, offset], type: sequelize.QueryTypes.SELECT }
  );

  return { rows, count: countResult.count };
}

export async function findSubscriptionByTenant(tenantId, id) {
  const result = await sequelize.query(
    `SELECT s.*, u.name AS user_name, u.email AS user_email,
            p.name AS plan_name, p.price, p.billing_interval
     FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     JOIN plans p ON p.id = s.plan_id
     WHERE s.id = $1 AND s.tenant_id = $2`,
    { bind: [id, tenantId], type: sequelize.QueryTypes.SELECT, plain: true }
  );
  if (!result) {
    throw new AppError("Subscription not found", 404);
  }
  return result;
}
