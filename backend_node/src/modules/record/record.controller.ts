import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as recordService from "./record.service.js";
import {
  CreateRecordBody,
  CreateRecordResponse,
  DeleteRecordParams,
  GetRecordsQuery,
  GetRecordsResponse,
  UpdateRecordBody,
  UpdateRecordParams,
} from "./record.types.js";

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

export const updateRecord = asyncHandler(
  async (
    req: Request<UpdateRecordParams, {}, UpdateRecordBody>,
    res: Response,
  ) => {
    const updatedRecord = await recordService.updateRecord(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Record updated successfully",
      data: updatedRecord,
    });
  },
);

export const deleteRecord = asyncHandler(
  async (req: Request<DeleteRecordParams>, res: Response) => {
    await recordService.deleteRecord(req.params.id);
    res.json({
      success: true,
      message: "Record deleted successfully",
    });
  },
);