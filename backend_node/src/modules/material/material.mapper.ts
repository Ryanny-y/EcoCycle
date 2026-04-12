import { Material } from "../../generated/prisma/client.js";
import { MaterialDto } from "./material.types.js";

export const toDto = (material: Material): MaterialDto => {
  return {
    id: material.id,
    name: material.name,
    description: material.description,
    pointsPerKg: material.pointsPerKg,
    imageUrl: material.imageUrl,
    imageKey: material.imageKey,
    createdAt: material.createdAt.toISOString(),
    updatedAt: material.updatedAt.toISOString(),
  };
};
