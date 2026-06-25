import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import * as dashboardController from "../controllers/dashboardController.js";

const router = Router();

router.get("/expiring-subscriptions", authenticate, authorize("ADMIN"), dashboardController.getExpiringSubscriptions);
router.get("/admin", authenticate, authorize("ADMIN"), dashboardController.getAdminDashboard);

export default router;
