import { logger } from "../config/index.js";
import * as tenantService from "../services/tenantService.js";

export async function createTenant(req, res, next) {
  try {
    const tenant = await tenantService.createTenant(req.body);
    logger.info({ tenantId: tenant.id }, "createTenant completed");
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    logger.error({ err, name: req.body.name }, "createTenant failed");
    next(err);
  }
}

export async function getTenants(req, res, next) {
  try {
    const { page, limit } = req.query;
    const { rows, count } = await tenantService.findAllTenants({ page, limit });
    logger.info({ count: rows.length, total: count }, "getTenants completed");
    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    logger.error({ err }, "getTenants failed");
    next(err);
  }
}

export async function getTenant(req, res, next) {
  try {
    const tenant = await tenantService.findTenantById(req.params.id);
    logger.info({ tenantId: tenant.id }, "getTenant completed");
    res.json({ success: true, data: tenant });
  } catch (err) {
    logger.error({ err, tenantId: req.params.id }, "getTenant failed");
    next(err);
  }
}
