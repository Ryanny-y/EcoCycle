import { prisma } from "../../../config/prisma.js";
import { Decimal } from "decimal.js";
import { CustomError } from "../../../middlewares/errorHandler.js";

export const earnPointsTransaction = async (
  recordId: string,
  totalPoints: Decimal,
  materialData: {
    materialId: string;
    weight: Decimal;
    points: Decimal;
  }[],
) => {
  return await prisma.$transaction(async (tx) => {
    const rewardActivity = await tx.rewardActivity.create({
      data: {
        recordId,
        points: totalPoints,
        type: "EARN",
        rewardMaterials: {
          create: materialData.map((m) => ({
            materialId: m.materialId,
            weight: m.weight,
            points: m.points,
          })),
        },
      },
      include: {
        rewardMaterials: {
          include: {
            material: true,
          },
        },
      },
    });

    const updatedRecord = await tx.record.update({
      where: { id: recordId },
      data: {
        points: {
          increment: totalPoints,
        },
      },
    });

    return { rewardActivity, updatedRecord };
  });
};

export const redeemItemTransaction = async (
  recordId: string,
  rewardItemId: string,
  quantity: number,
  totalCost: Decimal,
) => {
  return prisma.$transaction(async (tx) => {
    // Deduct points safely
    const recordUpdate = await tx.record.updateMany({
      where: {
        id: recordId,
        points: { gte: totalCost },
      },
      data: {
        points: { decrement: totalCost },
      },
    });

    if (recordUpdate.count === 0) {
      throw new CustomError(400, "Insufficient points.");
    }

    // Deduct stock safely
    const rewardItemUpdate = await tx.rewardItem.updateMany({
      where: {
        id: rewardItemId,
        stocks: { gte: quantity },
      },
      data: {
        stocks: { decrement: quantity },
      },
    });

    if (rewardItemUpdate.count === 0) {
      throw new CustomError(400, "Insufficient stock.");
    }

    // Fetch updated values
    const updatedRecord = await tx.record.findUnique({
      where: { id: recordId },
    });

    const updatedRewardItem = await tx.rewardItem.findUnique({
      where: { id: rewardItemId },
    });

    // Log activity last
    const rewardActivity = await tx.rewardActivity.create({
      data: {
        recordId,
        points: totalCost,
        type: "REDEEM",
      },
    });

    return { rewardActivity, updatedRecord, updatedRewardItem };
  });
};