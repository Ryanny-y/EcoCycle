import { prisma } from "../../config/prisma.js";
import { SubdivisionWhereInput } from "../../generated/prisma/models.js";

export const getByNameAndArea = async (name: string, area: number) => {
  return await prisma.subdivision.findUnique({
    where: {
      name_area: {
        name: name.toLowerCase(),
        area,
      },
    },
  });
};

export const createSubdivision = async (name: string, area: number) => {
  return await prisma.subdivision.create({
    data: {
      name,
      area,
    },
  });
};
