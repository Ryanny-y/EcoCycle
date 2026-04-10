import { CreateSubdivisionBody, SubdivisionDto } from "./subdivision.types.js";
import * as subdivisionRepo from "./subdivision.repository.js";
import { CustomError } from "../../middlewares/errorHandler.js";
import { toDto } from "./subdivision.mapper.js";

export const createSubdivision = async (data: CreateSubdivisionBody): Promise<SubdivisionDto> => {
  const { name, area } = data;

  const foundSubdivision = await subdivisionRepo.getByNameAndArea(name, area);

  if (foundSubdivision)
    throw new CustomError(
      404,
      `Subdivision already exists with ${name} and ${area}.`,
    );

  const createdSubdivision = await subdivisionRepo.createSubdivision(name, area);

  return toDto(createdSubdivision);
};
