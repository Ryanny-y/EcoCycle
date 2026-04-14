import z from "zod";
import { ApiResponse } from "../../../common/api.js";
import { earnPoints } from "./rewardActivity.schema.js";
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

// REQUEST
export type EarnPointsBody = z.infer<typeof earnPoints.body>;
export type EarnPointsParams = { recordId: string };

// RESPONSE
export type EarnPointsResponse = ApiResponse<EarnPointsDto>;
