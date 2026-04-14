import {
  EarnPointsBody,
  EarnPointsDto,
  RedeemItemBody,
  RedeemItemDto,
  StatisticsDto,
} from "./rewardActivity.types.js";
import { CustomError } from "../../../middlewares/errorHandler.js";
import { Decimal } from "decimal.js";
import * as recordRepo from "../../record/record.repository.js";
import * as materialRepo from "../../material/material.repository.js";
import * as rewardActivityRepo from "./rewardActivity.repository.js";
import * as rewardItemRepo from "../item/rewardItem.repository.js";
import { toEarnPointsDto, toRedeemItemDto } from "./rewardActivity.mapper.js";

export const earnPoints = async (
  recordId: string,
  data: EarnPointsBody,
): Promise<EarnPointsDto> => {
  const record = await recordRepo.getRecordById(recordId);

  if (!record) {
    throw new CustomError(404, `Record not found with ID: ${recordId}.`);
  }

  let totalPoints = new Decimal(0);
  const materialData = [];

  for (const materialInput of data.materials) {
    const material = await materialRepo.getMaterialById(materialInput.id);

    if (!material) {
      throw new CustomError(
        404,
        `Material not found with ID: ${materialInput.id}.`,
      );
    }

    const points = materialInput.weight.mul(material.pointsPerKg);
    totalPoints = totalPoints.add(points);

    materialData.push({
      materialId: material.id,
      materialName: material.name,
      weight: materialInput.weight,
      points,
    });
  }

  const { rewardActivity, updatedRecord } =
    await rewardActivityRepo.earnPointsTransaction(
      recordId,
      totalPoints,
      materialData,
    );

  return toEarnPointsDto(rewardActivity, updatedRecord, Number(totalPoints));
};

export const redeemItem = async (
  recordId: string,
  data: RedeemItemBody,
): Promise<RedeemItemDto> => {
  const record = await recordRepo.getRecordById(recordId);

  if (!record) {
    throw new CustomError(404, `Record not found with ID: ${recordId}.`);
  }

  const rewardItem = await rewardItemRepo.getRewardItemById(data.rewardItemId);

  if (!rewardItem) {
    throw new CustomError(
      404,
      `Reward item not found with ID: ${data.rewardItemId}.`,
    );
  }

  const totalCost = new Decimal(rewardItem.requiredPoints).mul(data.quantity);

  const { rewardActivity, updatedRecord, updatedRewardItem } =
    await rewardActivityRepo.redeemItemTransaction(
      recordId,
      data.rewardItemId,
      data.quantity,
      totalCost,
    );

  if (!updatedRecord || !updatedRewardItem) {
    throw new Error("Invariant failed: updated entities missing");
  }

  return toRedeemItemDto(
    rewardActivity,
    updatedRecord,
    rewardItem.id,
    rewardItem.name,
    data.quantity,
    Number(totalCost),
    updatedRewardItem.stocks,
  );
};

export const getStatistics = async (): Promise<StatisticsDto> => {
  const { earnedActivities, redeemedActivities, allRecords } =
    await rewardActivityRepo.getStatistics();

  const totalPointsEarned = earnedActivities.reduce(
    (sum, activity) => sum + Number(activity.points),
    0
  );

  const totalPointsRedeemed = redeemedActivities.reduce(
    (sum, activity) => sum + Number(activity.points),
    0
  );

  const totalActivePoints = allRecords.reduce(
    (sum, record) => sum + Number(record.points),
    0
  );

  const now = new Date();
  const lastMonthTrend = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const earnedPoints = earnedActivities
      .filter(
        (a) => a.createdAt >= monthStart && a.createdAt <= monthEnd
      )
      .reduce((sum, a) => sum + Number(a.points), 0);

    const redeemedPoints = redeemedActivities
      .filter(
        (a) => a.createdAt >= monthStart && a.createdAt <= monthEnd
      )
      .reduce((sum, a) => sum + Number(a.points), 0);

    lastMonthTrend.push({
      month: date.toLocaleString("en-US", { month: "short", year: "numeric" }),
      earnedPoints,
      redeemedPoints,
    });
  }

  const materialMap = new Map<string, number>();
  earnedActivities.forEach((activity) => {
    activity.rewardMaterials.forEach((rm) => {
      const current = materialMap.get(rm.material.name) || 0;
      materialMap.set(rm.material.name, current + Number(rm.weight));
    });
  });

  const materialCollections = Array.from(materialMap.entries()).map(
    ([materialName, totalWeight]) => ({
      materialName,
      totalWeight,
    })
  );

  const contributorMap = new Map<
    string,
    { earnedPoints: number; redeemedPoints: number; activityCount: number; record: any }
  >();

  earnedActivities.forEach((activity) => {
    const recordId = activity.recordId;
    const current = contributorMap.get(recordId) || {
      earnedPoints: 0,
      redeemedPoints: 0,
      activityCount: 0,
      record: activity.record,
    };
    current.earnedPoints += Number(activity.points);
    current.activityCount += 1;
    contributorMap.set(recordId, current);
  });

  redeemedActivities.forEach((activity) => {
    const recordId = activity.recordId;
    const current = contributorMap.get(recordId) || {
      earnedPoints: 0,
      redeemedPoints: 0,
      activityCount: 0,
      record: activity.record,
    };
    current.redeemedPoints += Number(activity.points);
    current.activityCount += 1;
    contributorMap.set(recordId, current);
  });

  const topContributors = Array.from(contributorMap.entries())
    .map(([_, data]) => ({
      fullName: `${data.record.firstName} ${data.record.lastName}`,
      earnedPoints: data.earnedPoints,
      redeemedPoints: data.redeemedPoints,
      activityCount: data.activityCount,
    }))
    .sort((a, b) => b.earnedPoints - a.earnedPoints)
    .slice(0, 10);

  return {
    totalPointsEarned,
    totalPointsRedeemed,
    totalActivePoints,
    lastMonthTrend,
    materialCollections,
    topContributors,
  };
};
