import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as rewardActivityService from "./rewardActivity.service.js";
import {
  EarnPointsBody,
  EarnPointsParams,
  EarnPointsResponse,
  RedeemItemBody,
  RedeemItemParams,
  RedeemItemResponse,
} from "./rewardActivity.types.js";

export const earnPoints = asyncHandler(
  async (
    req: Request<EarnPointsParams, {}, EarnPointsBody>,
    res: Response<EarnPointsResponse>
  ) => {
    const result = await rewardActivityService.earnPoints(
      req.params.recordId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Points earned successfully",
      data: result,
    });
  }
);

export const redeemItem = asyncHandler(
  async (
    req: Request<RedeemItemParams, {}, RedeemItemBody>,
    res: Response<RedeemItemResponse>
  ) => {
    const result = await rewardActivityService.redeemItem(
      req.params.recordId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Item redeemed successfully",
      data: result,
    });
  }
);
