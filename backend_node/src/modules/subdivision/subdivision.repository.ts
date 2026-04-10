import { prisma } from "../../config/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { SubdivisionWhereInput } from "../../generated/prisma/models.js";

export const getByNameAndArea = async (name: string, area: number) => {
  return await prisma.subdivision.findUnique({
    where: {
      name_area: {
        name: name,
        area,
      },
    },
  });
};

export const getSubdivisionsByFilter = async (where: SubdivisionWhereInput) => {
  return await prisma.subdivision.findMany({
    where,
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
