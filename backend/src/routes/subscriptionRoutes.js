import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createSubscriptionSchema, subscriptionParamsSchema } from "../validators/subscription.js";
import { paginationSchema } from "../validators/index.js";
import * as subscriptionController from "../controllers/subscriptionController.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.post("/", validate(createSubscriptionSchema, "body", { mergeUser: true }), subscriptionController.assignPlan);
router.get("/", validate(paginationSchema, "query"), subscriptionController.getSubscriptions);
router.get("/:id", validate(subscriptionParamsSchema, "params"), subscriptionController.getSubscription);

export default router;
