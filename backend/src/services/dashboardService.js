import sequelize from "../models/index.js";

export async function getAdminDashboard(tenantId) {
  const [[usersResult], [activeResult], [expiredResult], [revenueResult], distResult] =
    await Promise.all([
      sequelize.query(
        "SELECT COUNT(*)::int AS count FROM users WHERE tenant_id = $1 AND role != 'ADMIN'",
        { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        "SELECT COUNT(*)::int AS count FROM subscriptions WHERE tenant_id = $1 AND status = 'ACTIVE'",
        { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        "SELECT COUNT(*)::int AS count FROM subscriptions WHERE tenant_id = $1 AND status = 'EXPIRED'",
        { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        "SELECT COALESCE(SUM(amount), 0)::float AS total FROM billing_logs WHERE tenant_id = $1 AND status = 'SUCCESS'",
        { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
      ),
      sequelize.query(
        `SELECT p.name, COUNT(s.id)::int AS count
         FROM subscriptions s
         JOIN plans p ON p.id = s.plan_id
         WHERE s.tenant_id = $1
         GROUP BY p.name
         ORDER BY count DESC`,
        { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
      ),
    ]);

  return {
    totalUsers: usersResult.count,
    activeSubscriptions: activeResult.count,
    expiredSubscriptions: expiredResult.count,
    totalRevenue: revenueResult.total,
    planDistribution: distResult,
  };
}
