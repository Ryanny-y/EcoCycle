import { Router } from "express";
import * as rewardItemController from "./rewardItem.controller.js";
import verifyJwt from "../../../middlewares/verifyJwt.js";
import { validate } from "../../../middlewares/validate.js";
import { createRewardItem, rewardItemParams, updateRewardItem } from "./rewardItem.schema.js";
import { upload } from "../../../middlewares/upload.js";

const router = Router();

// ================ /api/rewards/items ============================
router.get("/", verifyJwt, rewardItemController.getRewardItems);
router.get("/:id", verifyJwt, validate(rewardItemParams), rewardItemController.getRewardItem);
router.post("/", verifyJwt, upload.single("image"), validate(createRewardItem), rewardItemController.createRewardItem);
router.patch("/:id", verifyJwt, upload.single("image"), validate(updateRewardItem), rewardItemController.updateRewardItem);
router.delete("/:id", verifyJwt, validate(rewardItemParams), rewardItemController.deleteRewardItem);

export default router;
