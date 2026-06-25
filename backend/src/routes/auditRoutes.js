import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { paginationSchema } from "../validators/index.js";
import * as auditController from "../controllers/auditController.js";

const router = Router();

router.get("/", authenticate, authorize("ADMIN"), validate(paginationSchema, "query"), auditController.getAuditLogs);

export default router;
