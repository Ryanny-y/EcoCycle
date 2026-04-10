import { CreateSubdivisionBody, SubdivisionDto } from "./subdivision.types.js";
import * as subdivisionRepo from "./subdivision.repository.js";
import { CustomError } from "../../middlewares/errorHandler.js";
import { toDto } from "./subdivision.mapper.js";

import { Prisma } from "../../generated/prisma/client.js";

export const createSubdivision = async (
  data: CreateSubdivisionBody,
): Promise<SubdivisionDto> => {
  const { name, area } = data;

  try {
    const foundSubdivision = await subdivisionRepo.getByNameAndArea(name, area);

    if (foundSubdivision) {
      throw new CustomError(
        409,
        `Subdivision already exists with ${name} and ${area}.`,
      );
    }

    const createdSubdivision = await subdivisionRepo.createSubdivision(
      name,
      area,
    );

    return toDto(createdSubdivision);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CustomError(
        409,
        `Subdivision already exists with ${name} and ${area}.`,
      );
    }

    throw error;
  }
};

export const getSubdivisionByArea = async (
  area: number,
): Promise<SubdivisionDto[]> => {
  const foundSubdivisions = await subdivisionRepo.getSubdivisionsByFilter({
    area,
  });

  return foundSubdivisions.map(subdivision => toDto(subdivision)); 
};
