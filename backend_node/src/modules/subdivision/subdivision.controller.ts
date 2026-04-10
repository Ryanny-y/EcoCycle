import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  CreateSubdivisionBody,
  createSubdivisionResponse,
  GetSubdivisionResponse,
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

export const getSubdivisionByArea = asyncHandler(
  async (
    req: Request<{ area: string }>,
    res: Response<GetSubdivisionResponse>,
  ) => {
    const { area } = req.params;
    const subdivisions = await subdivisionService.getSubdivisionByArea(
      Number(area),
    );

    res.json({
      success: true,
      message: "Subdivision fetched",
      data: subdivisions,
    });
  },
);
