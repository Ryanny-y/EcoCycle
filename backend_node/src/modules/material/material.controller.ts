import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as materialService from "./material.service.js";
import {
  CreateMaterialBody,
  CreateMaterialResponse,
  DeleteMaterialParams,
  GetMaterialParams,
  GetMaterialResponse,
  GetMaterialsResponse,
  UpdateMaterialBody,
  UpdateMaterialParams,
  UpdateMaterialResponse,
} from "./material.types.js";
import { ApiResponse } from "../../common/api.js";
import { MulterType } from "../../infra/storage/storage.types.js";

export const getMaterials = asyncHandler(
  async (req: Request, res: Response<GetMaterialsResponse>) => {
    const materials = await materialService.getMaterials();
    res.json({
      success: true,
      message: "Materials fetched successfully",
      data: materials,
    });
  }
);

export const getMaterial = asyncHandler(
  async (
    req: Request<GetMaterialParams>,
    res: Response<GetMaterialResponse>
  ) => {
    const material = await materialService.getMaterial(req.params.id);
    res.json({
      success: true,
      message: "Material fetched successfully",
      data: material,
    });
  }
);

export const createMaterial = asyncHandler(
  async (
    req: Request<{}, {}, CreateMaterialBody>,
    res: Response<CreateMaterialResponse>
  ) => {
    const file = req.file as MulterType;
    const newMaterial = await materialService.createMaterial(req.body, file);
    res.status(201).json({
      success: true,
      message: "Material created successfully",
      data: newMaterial,
    });
  }
);

export const updateMaterial = asyncHandler(
  async (
    req: Request<UpdateMaterialParams, {}, UpdateMaterialBody>,
    res: Response<UpdateMaterialResponse>
  ) => {
    const updatedMaterial = await materialService.updateMaterial(
      req.params.id,
      req.body
    );
    res.json({
      success: true,
      message: "Material updated successfully",
      data: updatedMaterial,
    });
  }
);

export const deleteMaterial = asyncHandler(
  async (
    req: Request<DeleteMaterialParams>,
    res: Response<ApiResponse<void>>
  ) => {
    await materialService.deleteMaterial(req.params.id);
    res.json({
      success: true,
      message: "Material deleted successfully",
    });
  }
);
