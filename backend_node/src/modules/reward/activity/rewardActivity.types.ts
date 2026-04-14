import z from "zod";
import { ApiResponse } from "../../../common/api.js";
import { earnPoints, redeemItem } from "./rewardActivity.schema.js";
import { RewardType } from "../../../generated/prisma/enums.js";

// DTO
export interface RewardActivityDto {
  id: string;
  recordId: string;
  points: number;
  type: RewardType;
  createdAt: string;
}

export interface RewardMaterialDto {
  id: string;
  materialId: string;
  materialName: string;
  weight: number;
  points: number;
}

export interface EarnPointsDto {
  activity: RewardActivityDto;
  materials: RewardMaterialDto[];
  totalPoints: number;
  newRecordPoints: number;
}

export interface RedeemItemDto {
  activity: RewardActivityDto;
  rewardItemId: string;
  rewardItemName: string;
  quantity: number;
  totalCost: number;
  newRecordPoints: number;
  newItemStocks: number;
}

export interface MonthlyTrendDto {
  month: string;
  earnedPoints: number;
  redeemedPoints: number;
}

export interface MaterialCollectionDto {
  materialName: string;
  totalWeight: number;
}

export interface TopContributorDto {
  fullName: string;
  earnedPoints: number;
  redeemedPoints: number;
  activityCount: number;
}

export interface StatisticsDto {
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalActivePoints: number;
  lastMonthTrend: MonthlyTrendDto[];
  materialCollections: MaterialCollectionDto[];
  topContributors: TopContributorDto[];
}

// REQUEST
export type EarnPointsBody = z.infer<typeof earnPoints.body>;
export type EarnPointsParams = z.infer<typeof earnPoints.params>;

export type RedeemItemBody = z.infer<typeof redeemItem.body>;
export type RedeemItemParams = z.infer<typeof redeemItem.params>;

// RESPONSE
export type EarnPointsResponse = ApiResponse<EarnPointsDto>;
export type RedeemItemResponse = ApiResponse<RedeemItemDto>;
export type StatisticsResponse = ApiResponse<StatisticsDto>;
