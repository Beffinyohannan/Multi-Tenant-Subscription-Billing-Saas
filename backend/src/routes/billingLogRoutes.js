import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBillingLogSchema, billingLogParamsSchema } from "../validators/billingLog.js";
import { paginationSchema } from "../validators/index.js";
import * as billingLogController from "../controllers/billingLogController.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.post("/", validate(createBillingLogSchema, "body", { mergeUser: true }), billingLogController.createLog);
router.get("/", validate(paginationSchema, "query"), billingLogController.getLogs);
router.get("/:id", validate(billingLogParamsSchema, "params"), billingLogController.getLog);

export default router;
