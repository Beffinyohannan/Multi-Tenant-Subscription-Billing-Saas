import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { createTenantSchema, tenantParamsSchema } from "../validators/tenant.js";
import * as tenantController from "../controllers/tenantController.js";

const router = Router();

router.post("/", validate(createTenantSchema), tenantController.createTenant);
router.get("/", tenantController.getTenants);
router.get("/:id", validate(tenantParamsSchema, "params"), tenantController.getTenant);

export default router;
