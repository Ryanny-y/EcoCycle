import { RewardItem } from "../../../generated/prisma/client.js";
import { RewardItemDto } from "./rewardItem.types.js";

export const toDto = (rewardItem: RewardItem): RewardItemDto => {
  return {
    id: rewardItem.id,
    name: rewardItem.name,
    description: rewardItem.description,
    itemType: rewardItem.itemType,
    mainCategory: rewardItem.mainCategory,
    subCategory: rewardItem.subCategory,
    requiredPoints: rewardItem.requiredPoints,
    unit: rewardItem.unit,
    farmOrigin: rewardItem.farmOrigin,
    stocks: rewardItem.stocks,
    lastRestocked: rewardItem.lastRestocked
      ? rewardItem.lastRestocked.toISOString()
      : null,
    imageUrl: rewardItem.imageUrl,
    imageKey: rewardItem.imageKey,
    createdAt: rewardItem.createdAt.toISOString(),
    updatedAt: rewardItem.updatedAt.toISOString(),
  };
};
