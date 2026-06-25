import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createPlanSchema, planParamsSchema } from "../validators/plan.js";
import * as planController from "../controllers/planController.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.post("/", validate(createPlanSchema, "body", { mergeUser: true }), planController.createPlan);
router.get("/", planController.getPlans);
router.get("/:id", validate(planParamsSchema, "params"), planController.getPlan);
router.delete("/:id", validate(planParamsSchema, "params"), planController.deletePlan);

export default router;
