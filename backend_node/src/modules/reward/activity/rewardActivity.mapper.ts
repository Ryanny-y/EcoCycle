import { RewardActivity, RewardMaterial, Material, Record } from "../../../generated/prisma/client.js";
import { EarnPointsDto, RedeemItemDto } from "./rewardActivity.types.js";

type RewardActivityWithMaterials = RewardActivity & {
  rewardMaterials: (RewardMaterial & {
    material: Material;
  })[];
};

export const toEarnPointsDto = (
  rewardActivity: RewardActivityWithMaterials,
  updatedRecord: Record,
  totalPoints: number
): EarnPointsDto => {
  return {
    activity: {
      id: rewardActivity.id,
      recordId: rewardActivity.recordId,
      points: Number(rewardActivity.points),
      type: rewardActivity.type,
      createdAt: rewardActivity.createdAt.toISOString(),
    },
    materials: rewardActivity.rewardMaterials.map((rm) => ({
      id: rm.id,
      materialId: rm.materialId,
      materialName: rm.material.name,
      weight: Number(rm.weight),
      points: Number(rm.points),
    })),
    totalPoints,
    newRecordPoints: Number(updatedRecord.points),
  };
};

export const toRedeemItemDto = (
  rewardActivity: RewardActivity,
  updatedRecord: Record,
  rewardItemId: string,
  rewardItemName: string,
  quantity: number,
  totalCost: number,
  newItemStocks: number
): RedeemItemDto => {
  return {
    activity: {
      id: rewardActivity.id,
      recordId: rewardActivity.recordId,
      points: Number(rewardActivity.points),
      type: rewardActivity.type,
      createdAt: rewardActivity.createdAt.toISOString(),
    },
    rewardItemId,
    rewardItemName,
    quantity,
    totalCost,
    newRecordPoints: Number(updatedRecord.points),
    newItemStocks,
  };
};
