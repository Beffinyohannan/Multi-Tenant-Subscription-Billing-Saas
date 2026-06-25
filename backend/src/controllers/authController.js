import { logger } from "../config/index.js";
import * as authService from "../services/authService.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api",
};

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie("access_token", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("refresh_token", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res) {
  res.clearCookie("access_token", COOKIE_OPTIONS);
  res.clearCookie("refresh_token", COOKIE_OPTIONS);
}

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    setAuthCookies(res, result);
    logger.info({ userId: result.user.id }, "register completed");
    res.status(201).json({ success: true, data: result.user });
  } catch (err) {
    logger.error({ err, email: req.body.email }, "register failed");
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    setAuthCookies(res, result);
    logger.info({ userId: result.user.id }, "login completed");
    res.json({ success: true, data: result.user });
  } catch (err) {
    logger.error({ err, email: req.body.email }, "login failed");
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      logger.warn("refresh failed - no refresh token");
      return res.status(401).json({ success: false, error: { message: "No refresh token" } });
    }
    const result = await authService.refresh(token);
    res.cookie("access_token", result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    logger.info("refresh completed");
    res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "refresh failed");
    next(err);
  }
}

export async function logout(req, res) {
  clearAuthCookies(res);
  logger.info("logout completed");
  res.json({ success: true, message: "Logged out" });
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
