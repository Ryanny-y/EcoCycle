import { Router } from "express";
import * as recordController from "./record.controller";
import verifyJwt from "../../middlewares/verifyJwt";
import { validate } from "../../middlewares/validate";
import { createRecord, getRecordsQuery } from "./record.schema";

const router = Router();

// ================ /api/records ============================

router.get("/", verifyJwt, validate(getRecordsQuery), recordController.getRecords);
router.post("/", verifyJwt, validate(createRecord), recordController.createRecord);

export default router;