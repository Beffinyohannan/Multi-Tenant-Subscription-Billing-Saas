import { logger } from "../config/index.js";
import * as billingLogService from "../services/billingLogService.js";

export async function createLog(req, res, next) {
  try {
    const log = await billingLogService.createLog(req.user.tenantId, req.body);
    logger.info({ logId: log.id, tenantId: req.user.tenantId }, "createLog completed");
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "createLog failed");
    next(err);
  }
}

export async function getLogs(req, res, next) {
  try {
    const { page, limit } = req.query;
    const { rows, count } = await billingLogService.findLogsByTenant(req.user.tenantId, { page, limit });
    logger.info({ count: rows.length, total: count, tenantId: req.user.tenantId }, "getLogs completed");
    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "getLogs failed");
    next(err);
  }
}

export async function getLog(req, res, next) {
  try {
    const log = await billingLogService.findLogByTenant(req.user.tenantId, req.params.id);
    logger.info({ logId: log.id, tenantId: req.user.tenantId }, "getLog completed");
    res.json({ success: true, data: log });
  } catch (err) {
    logger.error({ err, logId: req.params.id, tenantId: req.user.tenantId }, "getLog failed");
    next(err);
  }
}
