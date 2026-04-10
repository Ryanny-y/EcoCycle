import { Router } from "express";
import verifyJwt from "../../middlewares/verifyJwt.js";
import { validate } from "../../middlewares/validate.js";
import { createSubdivision } from "./subdivision.schema.js";
import * as subdivisionController from './subdivision.controller.js'

const router = Router();

router.post("/", verifyJwt, validate(createSubdivision), subdivisionController.createSubdivision)


export default router;