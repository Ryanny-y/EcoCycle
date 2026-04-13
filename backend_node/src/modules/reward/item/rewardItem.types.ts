import z from "zod";
import { ApiResponse } from "../../../common/api.js";
import { createRewardItem, rewardItemParams, updateRewardItem } from "./rewardItem.schema.js";
import { MainCategory, RewardItemType, Unit } from "../../../generated/prisma/enums.js";

// DTO
export interface RewardItemDto {
  id: string;
  name: string;
  description: string;
  itemType: RewardItemType;
  mainCategory: MainCategory;
  subCategory?: string;
  requiredPoints: number;
  unit: Unit;
  farmOrigin?: string;
  stocks: number;
  lastRestocked?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// REQUEST
export type CreateRewardItemBody = z.infer<typeof createRewardItem.body>;
export type UpdateRewardItemBody = z.infer<typeof updateRewardItem.body>;
export type UpdateRewardItemParams = z.infer<typeof updateRewardItem.params>;
export type DeleteRewardItemParams = z.infer<typeof rewardItemParams.params>;
export type GetRewardItemParams = z.infer<typeof rewardItemParams.params>;

// RESPONSE
export type GetRewardItemsResponse = ApiResponse<RewardItemDto[]>;
export type GetRewardItemResponse = ApiResponse<RewardItemDto>;
export type CreateRewardItemResponse = ApiResponse<RewardItemDto>;
export type UpdateRewardItemResponse = ApiResponse<RewardItemDto>;
