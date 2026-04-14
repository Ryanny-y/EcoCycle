import { Router } from "express";
import * as rewardActivityController from "./rewardActivity.controller.js";
import verifyJwt from "../../../middlewares/verifyJwt.js";
import { validate } from "../../../middlewares/validate.js";
import { earnPoints, redeemItem } from "./rewardActivity.schema.js";

const router = Router();

// ================ /api/rewards/activity ============================
router.post(
  "/earn/:recordId",
  verifyJwt,
  validate(earnPoints),
  rewardActivityController.earnPoints
);

router.post(
  "/redeem/:recordId",
  verifyJwt,
  validate(redeemItem),
  rewardActivityController.redeemItem
);

export default router;
