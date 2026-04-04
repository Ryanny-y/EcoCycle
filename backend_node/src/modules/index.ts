import { Router } from "express";
import authRoutes from './auth/auth.routes';
import recordRoutes from './record/record.routes';

const router = Router();

// auth
router.use("/auth", authRoutes)

// protected
router.use("/records", recordRoutes)

export default router;