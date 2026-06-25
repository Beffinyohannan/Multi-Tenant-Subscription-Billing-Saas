import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import * as billingController from "../controllers/billingController.js";

const router = Router();

router.post("/run", authenticate, authorize("ADMIN"), billingController.runBilling);

export default router;
