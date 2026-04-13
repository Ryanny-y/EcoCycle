import { Router } from "express";
import authRoutes from './auth/auth.routes.js';
import recordRoutes from './record/record.routes.js';
import subdivisionRoutes from './subdivision/subdivision.routes.js';
import materialRoutes from './material/material.routes.js';
import rewardItemRoutes from './reward/item/rewardItem.routes.js';

const router = Router();

// auth
router.use("/auth", authRoutes)

// protected
router.use("/subdivision", subdivisionRoutes)
router.use("/records", recordRoutes)
router.use("/materials", materialRoutes)
router.use("/rewards/items", rewardItemRoutes)

export default router;