import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import * as auditController from "../controllers/auditController.js";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), auditController.getAuditLogs);

export default router;
