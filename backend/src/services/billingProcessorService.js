import sequelize from "../models/index.js";
import logger from "../config/logger.js";

function currentBillingPeriod() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function runBilling(tenantId) {
  const period = currentBillingPeriod();

  const activeSubs = await sequelize.query(
    `SELECT s.id, s.tenant_id, s.user_id, s.plan_id, s.end_date,
            p.price, p.name AS plan_name
     FROM subscriptions s
     JOIN plans p ON p.id = s.plan_id AND p.tenant_id = s.tenant_id
     WHERE s.status = 'ACTIVE' AND s.tenant_id = $1`,
    { bind: [tenantId], type: sequelize.QueryTypes.SELECT }
  );

  let generated = 0;
  let expired = 0;
  let skipped = 0;

  const t = await sequelize.transaction();

  try {
    for (const sub of activeSubs) {
      if (sub.end_date && new Date(sub.end_date) < new Date()) {
        await sequelize.query(
          "UPDATE subscriptions SET status = 'EXPIRED' WHERE id = $1",
          { bind: [sub.id], type: sequelize.QueryTypes.UPDATE, transaction: t }
        );
        expired++;
        continue;
      }

      const existing = await sequelize.query(
        "SELECT id FROM billing_logs WHERE subscription_id = $1 AND billing_period = $2",
        { bind: [sub.id, period], type: sequelize.QueryTypes.SELECT, plain: true, transaction: t }
      );

      if (existing) {
        skipped++;
        continue;
      }

      try {
        await sequelize.query(
          `INSERT INTO billing_logs (tenant_id, user_id, subscription_id, plan_id, amount, status, billing_period)
           VALUES ($1, $2, $3, $4, $5, 'SUCCESS', $6)`,
          { bind: [sub.tenant_id, sub.user_id, sub.id, sub.plan_id, sub.price, period], transaction: t }
        );
        generated++;
      } catch (insertErr) {
        if (insertErr?.parent?.code === "23505") {
          skipped++;
          continue;
        }
        throw insertErr;
      }
    }

    await t.commit();

    logger.info(
      { processed: activeSubs.length, generated, expired, skipped, period },
      "Billing run completed"
    );

    return {
      processed: activeSubs.length,
      generated,
      expired,
      skipped,
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
