import { ZodError } from "zod";
import { logger } from "../config/index.js";

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    logger.warn({ statusCode: err.statusCode, message: err.message }, "Operational error");
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message },
    });
    return;
  }

  if (err instanceof ZodError) {
    logger.warn({ issues: err.issues }, "Validation error");
    res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        details: err.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
    });
    return;
  }

  logger.error(err, "Unexpected error");
  res.status(500).json({
    success: false,
    error: { message: "Internal server error" },
  });
}
