import { Router } from "express";
import * as authController from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { loginSchema, refreshTokenSchema, signupSchema } from "./auth.schema";
const router = Router();

// Login
router.post("/login", validate(loginSchema), authController.login);
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/refresh-token", validate(refreshTokenSchema), authController.signup);

export default router;
