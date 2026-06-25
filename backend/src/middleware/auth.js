import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "./errorHandler.js";

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return req.cookies?.access_token || null;
}

export function authenticate(req, _res, next) {
  const token = extractToken(req);

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}

export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
}
