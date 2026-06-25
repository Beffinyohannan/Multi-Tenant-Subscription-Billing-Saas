import { logger } from "../config/index.js";
import * as billingProcessorService from "../services/billingProcessorService.js";
import * as auditService from "../services/auditService.js";

export async function runBilling(req, res, next) {
  try {
    const result = await billingProcessorService.runBilling(req.user.tenantId);
    await auditService.log({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      action: "BILLING_RUN",
      entityType: "billing",
      entityId: null,
      metadata: result,
    });
    logger.info({ tenantId: req.user.tenantId }, "runBilling completed");
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "runBilling failed");
    next(err);
  }
}
