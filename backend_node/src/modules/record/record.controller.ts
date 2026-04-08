import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as recordService from "./record.service";
import {
  CreateRecordBody,
  CreateRecordResponse,
  GetRecordsQuery,
  GetRecordsResponse,
} from "./record.types";

export const getRecords = asyncHandler(
  async (
    req: Request<{}, {}, {}, GetRecordsQuery>,
    res: Response<GetRecordsResponse>,
  ) => {
    const pageRecords = await recordService.getRecords(req.query);
    const response = {
      success: true,
      message: "Records fetched successfully",
      data: pageRecords,
    };

    res.json(response);
  },
);

export const createRecord = asyncHandler(
  async (
    req: Request<{}, {}, CreateRecordBody>,
    res: Response<CreateRecordResponse>,
  ) => {
    const newRecord = await recordService.createRecord(req.body);
    const response = {
      success: true,
      message: "Record created successfully",
      data: newRecord,
    };
    res.status(201).json(response);
  },
);
