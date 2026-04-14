import { EarnPointsBody, EarnPointsDto } from "./rewardActivity.types.js";
import { CustomError } from "../../../middlewares/errorHandler.js";
import { Decimal } from "decimal.js";
import * as recordRepo from "../../record/record.repository.js";
import * as materialRepo from "../../material/material.repository.js";
import * as rewardActivityRepo from "./rewardActivity.repository.js";
import { toEarnPointsDto } from "./rewardActivity.mapper.js";

export const earnPoints = async (
  recordId: string,
  data: EarnPointsBody
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
        `Material not found with ID: ${materialInput.id}.`
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
      materialData
    );

  return toEarnPointsDto(rewardActivity, updatedRecord, Number(totalPoints));
};
