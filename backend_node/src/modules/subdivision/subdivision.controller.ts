import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  CreateSubdivisionBody,
  createSubdivisionResponse,
} from "./subdivision.types.js";
import * as subdivisionService from "./subdivision.service.js";

export const createSubdivision = asyncHandler(
  async (
    req: Request<{}, {}, CreateSubdivisionBody>,
    res: Response<createSubdivisionResponse>,
  ) => {
    const subdivision = await subdivisionService.createSubdivision(req.body);

    res.json({
      success: true,
      message: "Subdivision Created",
      data: subdivision,
    });
  },
);
