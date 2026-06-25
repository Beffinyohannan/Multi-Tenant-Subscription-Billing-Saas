import { logger } from "../config/index.js";
import * as planService from "../services/planService.js";
import * as auditService from "../services/auditService.js";

export async function createPlan(req, res, next) {
  try {
    const plan = await planService.createPlan(req.body);
    await auditService.log({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      action: "PLAN_CREATED",
      entityType: "plan",
      entityId: plan.id,
      metadata: { name: plan.name },
    });
    logger.info({ planId: plan.id, tenantId: req.user.tenantId }, "createPlan completed");
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId, name: req.body.name }, "createPlan failed");
    next(err);
  }
}

export async function getPlans(req, res, next) {
  try {
    const plans = await planService.findAllPlans(req.user.tenantId);
    logger.info({ count: plans.length, tenantId: req.user.tenantId }, "getPlans completed");
    res.json({ success: true, data: plans });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "getPlans failed");
    next(err);
  }
}

export async function getPlan(req, res, next) {
  try {
    const plan = await planService.findPlanById(req.params.id, req.user.tenantId);
    logger.info({ planId: plan.id, tenantId: req.user.tenantId }, "getPlan completed");
    res.json({ success: true, data: plan });
  } catch (err) {
    logger.error({ err, planId: req.params.id, tenantId: req.user.tenantId }, "getPlan failed");
    next(err);
  }
}

export async function deletePlan(req, res, next) {
  try {
    const result = await planService.deletePlan(req.params.id, req.user.tenantId);
    await auditService.log({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      action: "PLAN_DELETED",
      entityType: "plan",
      entityId: req.params.id,
    });
    logger.info({ planId: req.params.id, tenantId: req.user.tenantId }, "deletePlan completed");
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error({ err, planId: req.params.id, tenantId: req.user.tenantId }, "deletePlan failed");
    next(err);
  }
}
