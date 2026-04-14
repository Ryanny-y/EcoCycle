import { prisma } from "../../../config/prisma.js";
import { Decimal } from "decimal.js";

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
