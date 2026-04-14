import { Router } from "express";
import * as rewardActivityController from "./rewardActivity.controller.js";
import verifyJwt from "../../../middlewares/verifyJwt.js";
import { validate } from "../../../middlewares/validate.js";
import { earnPoints } from "./rewardActivity.schema.js";

const router = Router();

// ================ /api/rewards/activity ============================
router.post(
  "/earn/:recordId",
  verifyJwt,
  validate(earnPoints),
  rewardActivityController.earnPoints
);

export default router;
