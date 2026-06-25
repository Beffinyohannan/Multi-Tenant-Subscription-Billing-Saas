import sequelize from "../models/index.js";

export async function log({ tenantId, userId, action, entityType, entityId, metadata }) {
  const result = await sequelize.query(
    `INSERT INTO audit_logs (tenant_id, user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)
     RETURNING *`,
    {
      bind: [tenantId, userId, action, entityType, entityId, metadata ? JSON.stringify(metadata) : null],
      type: sequelize.QueryTypes.SELECT,
      plain: true,
    }
  );
  return result;
}

export async function findLogsByTenant(tenantId) {
  return sequelize.query(
    `SELECT l.*, u.name AS user_name, u.email AS user_email
     FROM audit_logs l
     JOIN users u ON u.id = l.user_id
     WHERE l.tenant_id = $1
     ORDER BY l.created_at DESC`,
    { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
  );
}
