import sequelize from "../models/index.js";
import { AppError } from "../middleware/errorHandler.js";

export async function createLog(tenantId, { subscriptionId, amount, status, billingPeriod }) {
  const sub = await sequelize.query(
    `SELECT s.id, s.user_id, s.plan_id
     FROM subscriptions s
     WHERE s.id = $1 AND s.tenant_id = $2`,
    { bind: [subscriptionId, tenantId], type: sequelize.QueryTypes.SELECT, plain: true }
  );

  if (!sub) {
    throw new AppError("Subscription not found in this tenant", 404);
  }

  try {
    const result = await sequelize.query(
      `INSERT INTO billing_logs (tenant_id, user_id, subscription_id, plan_id, amount, status, billing_period)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      {
        bind: [tenantId, sub.user_id, subscriptionId, sub.plan_id, amount, status, billingPeriod],
        type: sequelize.QueryTypes.SELECT,
        plain: true,
      }
    );
    return result;
  } catch (err) {
    if (err.parent && err.parent.code === "23505") {
      throw new AppError("Billing log already exists for this subscription and period", 409);
    }
    throw err;
  }
}

export async function findLogsByTenant(tenantId) {
  return sequelize.query(
    `SELECT l.*, u.name AS user_name, u.email AS user_email,
            p.name AS plan_name, s.status AS subscription_status
     FROM billing_logs l
     JOIN users u ON u.id = l.user_id
     JOIN plans p ON p.id = l.plan_id
     JOIN subscriptions s ON s.id = l.subscription_id
     WHERE l.tenant_id = $1
     ORDER BY l.created_at DESC`,
    { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
  );
}

export async function findLogByTenant(tenantId, id) {
  const result = await sequelize.query(
    `SELECT l.*, u.name AS user_name, u.email AS user_email,
            p.name AS plan_name, s.status AS subscription_status
     FROM billing_logs l
     JOIN users u ON u.id = l.user_id
     JOIN plans p ON p.id = l.plan_id
     JOIN subscriptions s ON s.id = l.subscription_id
     WHERE l.id = $1 AND l.tenant_id = $2`,
    { bind: [id, tenantId], type: sequelize.QueryTypes.SELECT, plain: true }
  );
  if (!result) {
    throw new AppError("Billing log not found", 404);
  }
  return result;
}
