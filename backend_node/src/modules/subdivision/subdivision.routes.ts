import { Router } from "express";
import verifyJwt from "../../middlewares/verifyJwt.js";
import { validate } from "../../middlewares/validate.js";
import { createSubdivision, subdivisionParams } from "./subdivision.schema.js";
import * as subdivisionController from "./subdivision.controller.js";

const router = Router();

router.post(
  "/",
  verifyJwt,
  validate(createSubdivision),
  subdivisionController.createSubdivision,
);

router.get("/:area", verifyJwt, validate(subdivisionParams), subdivisionController.getSubdivisionByArea);

export default router;
