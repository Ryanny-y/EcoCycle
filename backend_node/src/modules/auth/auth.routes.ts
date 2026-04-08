import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, refreshTokenSchema, signupSchema } from "./auth.schema.js";
const router = Router();

// Login
router.post("/login", validate(loginSchema), authController.login);
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);
router.post("/logout", validate(refreshTokenSchema), authController.logout);

export default router;
