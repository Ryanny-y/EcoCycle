import { Router } from "express";
import * as materialController from "./material.controller.js";
import verifyJwt from "../../middlewares/verifyJwt.js";
import { validate } from "../../middlewares/validate.js";
import {
  createMaterial,
  materialParams,
  updateMaterial,
} from "./material.schema.js";
import { upload } from "../../middlewares/upload.js";

const router = Router();

// ================ /api/materials ============================
router.get("/", verifyJwt, materialController.getMaterials);
router.get(
  "/:id",
  verifyJwt,
  validate(materialParams),
  materialController.getMaterial,
);
router.post(
  "/",
  verifyJwt,
  upload.single("image"),
  validate(createMaterial),
  materialController.createMaterial,
);
router.patch(
  "/:id",
  verifyJwt,
  upload.single("image"),
  validate(updateMaterial),
  materialController.updateMaterial,
);
router.delete(
  "/:id",
  verifyJwt,
  validate(materialParams),
  materialController.deleteMaterial,
);

export default router;
