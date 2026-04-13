import { prisma } from "../../../config/prisma.js";
import { RewardItemCreateInput, RewardItemUpdateInput } from "../../../generated/prisma/models.js";

export const getAllRewardItems = () => {
  return prisma.rewardItem.findMany({
    orderBy: { name: "asc" },
  });
};

export const getRewardItemById = (id: string) => {
  return prisma.rewardItem.findUnique({ where: { id } });
};

export const getRewardItemByName = (name: string) => {
  return prisma.rewardItem.findUnique({ where: { name } });
};

export const createRewardItem = (data: RewardItemCreateInput) => {
  return prisma.rewardItem.create({ data });
};

export const updateRewardItem = (id: string, data: RewardItemUpdateInput) => {
  return prisma.rewardItem.update({
    where: { id },
    data,
  });
};

export const deleteRewardItem = async (id: string) => {
  return await prisma.rewardItem.delete({
    where: { id },
  });
};
