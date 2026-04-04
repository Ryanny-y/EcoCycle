import { Router } from "express";
import authRoute from './auth/auth.routes';

const router = Router();

router.use("/auth", authRoute)


export default router;