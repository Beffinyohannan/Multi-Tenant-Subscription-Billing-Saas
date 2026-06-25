import { logger } from "../config/index.js";
import * as subscriptionService from "../services/subscriptionService.js";
import * as auditService from "../services/auditService.js";

export async function assignPlan(req, res, next) {
  try {
    const subscription = await subscriptionService.assignPlan(req.user.tenantId, req.body);
    await auditService.log({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      action: "SUBSCRIPTION_ASSIGNED",
      entityType: "subscription",
      entityId: subscription.id,
      metadata: { userId: req.body.userId, planId: req.body.planId },
    });
    logger.info({ subscriptionId: subscription.id, tenantId: req.user.tenantId }, "assignPlan completed");
    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId, userId: req.body.userId, planId: req.body.planId }, "assignPlan failed");
    next(err);
  }
}

export async function getSubscriptions(req, res, next) {
  try {
    const { page, limit } = req.query;
    const { rows, count } = await subscriptionService.findSubscriptionsByTenant(req.user.tenantId, { page, limit });
    logger.info({ count: rows.length, total: count, tenantId: req.user.tenantId }, "getSubscriptions completed");
    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "getSubscriptions failed");
    next(err);
  }
}

export async function getSubscription(req, res, next) {
  try {
    const subscription = await subscriptionService.findSubscriptionByTenant(req.user.tenantId, req.params.id);
    logger.info({ subscriptionId: subscription.id, tenantId: req.user.tenantId }, "getSubscription completed");
    res.json({ success: true, data: subscription });
  } catch (err) {
    logger.error({ err, subscriptionId: req.params.id, tenantId: req.user.tenantId }, "getSubscription failed");
    next(err);
  }
}
