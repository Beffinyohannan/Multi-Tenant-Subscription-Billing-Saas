import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, userParamsSchema } from "../validators/user.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.get("/me", authenticate, userController.getMe);

router.use(authenticate, authorize("ADMIN"));

router.post("/", validate(createUserSchema, "body", { mergeUser: true }), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", validate(userParamsSchema, "params"), userController.getUser);
router.delete("/:id", validate(userParamsSchema, "params"), userController.deleteUser);

export default router;
