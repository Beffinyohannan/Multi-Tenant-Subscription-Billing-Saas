import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env, logger } from "./config/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authLimiter, apiLimiter } from "./middleware/rateLimiter.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import billingLogRoutes from "./routes/billingLogRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

const app = express();

const corsOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim().replace(/\/$/, ""));

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/tenants", tenantRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/billing-logs", billingLogRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/audit-logs", auditRoutes);

app.use(errorHandler);

export default app;
