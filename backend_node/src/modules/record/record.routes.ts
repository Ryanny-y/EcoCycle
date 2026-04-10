import { Router } from "express";
import * as recordController from "./record.controller.js";
import verifyJwt from "../../middlewares/verifyJwt.js";
import { validate } from "../../middlewares/validate.js";
import { createRecord, deleteRecord, getRecordsQuery, lookupRecord, updateRecord } from "./record.schema.js";
import { record } from "zod";

const router = Router();

// ================ /api/records ============================
// CRUD
router.get("/", verifyJwt, validate(getRecordsQuery), recordController.getRecords);
router.post("/", verifyJwt, validate(createRecord), recordController.createRecord);

router.put("/:id", verifyJwt, validate(updateRecord), recordController.updateRecord)
router.delete("/:id", verifyJwt, validate(deleteRecord), recordController.deleteRecord);

// OTHER ENDPOINTS
router.get("/lookup", verifyJwt, validate(lookupRecord), recordController.lookupRecord)

export default router;