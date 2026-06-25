import { logger } from "../config/index.js";
import * as auditService from "../services/auditService.js";

export async function getAuditLogs(req, res, next) {
  try {
    const logs = await auditService.findLogsByTenant(req.user.tenantId);
    logger.info({ count: logs.length, tenantId: req.user.tenantId }, "getAuditLogs completed");
    res.json({ success: true, data: logs });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "getAuditLogs failed");
    next(err);
  }
}
