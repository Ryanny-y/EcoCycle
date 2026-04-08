import { Router } from "express";
import * as recordController from "./record.controller.js";
import verifyJwt from "../../middlewares/verifyJwt.js";
import { validate } from "../../middlewares/validate.js";
import { createRecord, getRecordsQuery } from "./record.schema.js";

const router = Router();

// ================ /api/records ============================

router.get("/", verifyJwt, validate(getRecordsQuery), recordController.getRecords);
router.post("/", verifyJwt, validate(createRecord), recordController.createRecord);

export default router;