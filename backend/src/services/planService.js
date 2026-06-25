import sequelize, { Tenant } from "../models/index.js";
import { AppError } from "../middleware/errorHandler.js";

export async function createPlan({ tenantId, name, price, billingInterval }) {
  const tenant = await Tenant.findByPk(tenantId, { raw: true });
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  const [plan] = await sequelize.query(
    `INSERT INTO plans (tenant_id, name, price, billing_interval)
     VALUES ($1, $2, $3, $4)
     RETURNING id, tenant_id, name, price, billing_interval, created_at, updated_at`,
    { bind: [tenantId, name, price, billingInterval], type: sequelize.QueryTypes.SELECT }
  );

  return plan;
}

export async function findAllPlans(tenantId, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const countResult = await sequelize.query(
    `SELECT COUNT(*)::int AS count FROM plans WHERE tenant_id = $1`,
    { bind: [tenantId], type: sequelize.QueryTypes.SELECT, plain: true }
  );

  const rows = await sequelize.query(
    `SELECT id, tenant_id, name, price, billing_interval, created_at, updated_at
     FROM plans
     WHERE tenant_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    { bind: [tenantId, limit, offset], type: sequelize.QueryTypes.SELECT }
  );

  return { rows, count: countResult.count };
}

export async function findPlanById(id, tenantId) {
  const [plan] = await sequelize.query(
    `SELECT id, tenant_id, name, price, billing_interval, created_at, updated_at
     FROM plans
     WHERE id = $1 AND tenant_id = $2`,
    { bind: [id, tenantId], type: sequelize.QueryTypes.SELECT }
  );

  if (!plan) {
    throw new AppError("Plan not found", 404);
  }
  return plan;
}

export async function deletePlan(id, tenantId) {
  const [_, meta] = await sequelize.query(
    "DELETE FROM plans WHERE id = $1 AND tenant_id = $2",
    { bind: [id, tenantId], type: sequelize.QueryTypes.DELETE }
  );
  if (meta.rowCount === 0) {
    throw new AppError("Plan not found", 404);
  }
  return { id };
}
