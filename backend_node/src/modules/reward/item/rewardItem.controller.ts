import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as rewardItemService from "./rewardItem.service.js";
import {
  CreateRewardItemBody,
  CreateRewardItemResponse,
  DeleteRewardItemParams,
  GetRewardItemParams,
  GetRewardItemResponse,
  GetRewardItemsResponse,
  UpdateRewardItemBody,
  UpdateRewardItemParams,
  UpdateRewardItemResponse,
} from "./rewardItem.types.js";
import { ApiResponse } from "../../../common/api.js";
import { MulterType } from "../../../infra/storage/storage.types.js";

export const getRewardItems = asyncHandler(
  async (req: Request, res: Response<GetRewardItemsResponse>) => {
    const rewardItems = await rewardItemService.getRewardItems();
    res.json({
      success: true,
      message: "Reward items fetched successfully",
      data: rewardItems,
    });
  }
);

export const getRewardItem = asyncHandler(
  async (
    req: Request<GetRewardItemParams>,
    res: Response<GetRewardItemResponse>
  ) => {
    const rewardItem = await rewardItemService.getRewardItem(req.params.id);
    res.json({
      success: true,
      message: "Reward item fetched successfully",
      data: rewardItem,
    });
  }
);

export const createRewardItem = asyncHandler(
  async (
    req: Request<{}, {}, CreateRewardItemBody>,
    res: Response<CreateRewardItemResponse>
  ) => {
    const file = req.file as MulterType | undefined;
    const newRewardItem = await rewardItemService.createRewardItem(req.body, file);
    res.status(201).json({
      success: true,
      message: "Reward item created successfully",
      data: newRewardItem,
    });
  }
);

export const updateRewardItem = asyncHandler(
  async (
    req: Request<UpdateRewardItemParams, {}, UpdateRewardItemBody>,
    res: Response<UpdateRewardItemResponse>
  ) => {
    const file = req.file as MulterType | undefined;
    const updatedRewardItem = await rewardItemService.updateRewardItem(
      req.params.id,
      req.body,
      file
    );
    res.json({
      success: true,
      message: "Reward item updated successfully",
      data: updatedRewardItem,
    });
  }
);

export const deleteRewardItem = asyncHandler(
  async (
    req: Request<DeleteRewardItemParams>,
    res: Response<ApiResponse<void>>
  ) => {
    await rewardItemService.deleteRewardItem(req.params.id);
    res.json({
      success: true,
      message: "Reward item deleted successfully",
    });
  }
);
