import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as recordService from "./record.service";
import { GetRecordsQuery, GetRecordsResponse } from "./record.types";
import { success } from "zod";

export const getRecords = asyncHandler(
  async (
    req: Request<{}, {}, {}, GetRecordsQuery>,
    res: Response<GetRecordsResponse>,
    next: NextFunction,
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
