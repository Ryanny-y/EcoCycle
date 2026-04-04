import { Router } from "express";
import * as recordController from "./record.controller";
import verifyJwt from "../../middlewares/verifyJwt";
import { validate } from "../../middlewares/validate";
import { getRecordsQuery } from "./record.schema";

const router = Router();

// ================ /api/records ============================

router.get("/", validate(getRecordsQuery), recordController.getRecords);



export default router;