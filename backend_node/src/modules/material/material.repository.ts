import { prisma } from "../../config/prisma.js";
import { MaterialCreateInput, MaterialUpdateInput } from "../../generated/prisma/models.js";

export const getAllMaterials = () => {
  return prisma.material.findMany({
    orderBy: { name: "asc" },
  });
};

export const getMaterialById = (id: string) => {
  return prisma.material.findUnique({ where: { id } });
};

export const createMaterial = (data: MaterialCreateInput) => {
  return prisma.material.create({ data });
};

export const updateMaterial = (id: string, data: MaterialUpdateInput) => {
  return prisma.material.update({
    where: { id },
    data,
  });
};

export const deleteMaterial = (id: string) => {
  return prisma.material.delete({
    where: { id },
  });
};
