import { logger } from "../config/index.js";
import * as dashboardService from "../services/dashboardService.js";

export async function getAdminDashboard(req, res, next) {
  try {
    const data = await dashboardService.getAdminDashboard(req.user.tenantId);
    logger.info({ tenantId: req.user.tenantId }, "getAdminDashboard completed");
    res.json({ success: true, data });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "getAdminDashboard failed");
    next(err);
  }
}
