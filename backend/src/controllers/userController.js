import { logger } from "../config/index.js";
import * as userService from "../services/userService.js";
import * as authService from "../services/authService.js";
import * as auditService from "../services/auditService.js";

export async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.user.tenantId, req.body);
    await auditService.log({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      action: "USER_CREATED",
      entityType: "user",
      entityId: user.id,
      metadata: { email: user.email },
    });
    logger.info({ userId: user.id, tenantId: req.user.tenantId }, "createUser completed");
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId, email: req.body.email }, "createUser failed");
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const users = await userService.findUsersByTenant(req.user.tenantId);
    logger.info({ count: users.length, tenantId: req.user.tenantId }, "getUsers completed");
    res.json({ success: true, data: users });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId }, "getUsers failed");
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.userId);
    logger.info({ userId: req.user.userId }, "getMe completed");
    res.json({ success: true, data: user });
  } catch (err) {
    logger.error({ err, userId: req.user.userId }, "getMe failed");
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await userService.findUserByTenant(req.user.tenantId, req.params.id);
    logger.info({ userId: user.id, tenantId: req.user.tenantId }, "getUser completed");
    res.json({ success: true, data: user });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId, targetUserId: req.params.id }, "getUser failed");
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const result = await userService.deleteUserFromTenant(req.user.tenantId, req.params.id);
    await auditService.log({
      tenantId: req.user.tenantId,
      userId: req.user.userId,
      action: "USER_DELETED",
      entityType: "user",
      entityId: req.params.id,
    });
    logger.info({ tenantId: req.user.tenantId, targetUserId: req.params.id }, "deleteUser completed");
    res.json({ success: true, data: result });
  } catch (err) {
    logger.error({ err, tenantId: req.user.tenantId, targetUserId: req.params.id }, "deleteUser failed");
    next(err);
  }
}
