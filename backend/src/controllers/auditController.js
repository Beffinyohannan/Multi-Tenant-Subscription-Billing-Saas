import { logger } from "../config/index.js";
import * as auditService from "../services/auditService.js";

export async function getAuditLogs(req, res, next) {
  try {
    const { page, limit } = req.query;
    const { rows, count } = await auditService.findLogsByTenant(req.user.tenantId, { page, limit });
    logger.info({ count: rows.length, total: count, tenantId: req.user.tenantId }, "getAuditLogs completed");
    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "getAuditLogs failed");
    next(err);
  }
}
