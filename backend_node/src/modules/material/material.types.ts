import z from "zod";
import { ApiResponse } from "../../common/api.js";
import { createMaterial, materialParams, updateMaterial } from "./material.schema.js";

// DTO
export interface MaterialDto {
  id: string;
  name: string;
  description: string;
  pointsPerKg: number;
  imageUrl: string;
  imageKey: string;
  createdAt: string;
  updatedAt: string;
}

// REQUEST
export type CreateMaterialBody = z.infer<typeof createMaterial.body>;
export type UpdateMaterialBody = z.infer<typeof updateMaterial.body>;
export type UpdateMaterialParams = z.infer<typeof updateMaterial.params>;
export type DeleteMaterialParams = z.infer<typeof materialParams.params>;
export type GetMaterialParams = z.infer<typeof materialParams.params>;

// RESPONSE
export type GetMaterialsResponse = ApiResponse<MaterialDto[]>;
export type GetMaterialResponse = ApiResponse<MaterialDto>;
export type CreateMaterialResponse = ApiResponse<MaterialDto>;
export type UpdateMaterialResponse = ApiResponse<MaterialDto>;
