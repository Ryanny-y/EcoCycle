import {
  CreateMaterialBody,
  MaterialDto,
  UpdateMaterialBody,
} from "./material.types.js";
import * as materialRepo from "./material.repository.js";
import { toDto } from "./material.mapper.js";
import { CustomError } from "../../middlewares/errorHandler.js";
import { Prisma } from "../../generated/prisma/client.js";
import { MulterType } from "../../infra/storage/storage.types.js";
import { deleteFile, uploadFile } from "../../infra/storage/s3.service.js";

export const getMaterials = async (): Promise<MaterialDto[]> => {
  const materials = await materialRepo.getAllMaterials();
  return materials.map((material) => toDto(material));
};

export const getMaterial = async (id: string): Promise<MaterialDto> => {
  const material = await materialRepo.getMaterialById(id);

  if (!material) {
    throw new CustomError(404, `Material not found with ID: ${id}.`);
  }

  return toDto(material);
};

export const createMaterial = async (
  data: CreateMaterialBody,
  file: MulterType,
): Promise<MaterialDto> => {
  let uploadedImage;
  try {
    // Upload Image to AWS
    uploadedImage = await uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      "materials",
    );

    // Create the material after uploading
    const newMaterial = await materialRepo.createMaterial({
      ...data,
      description: data.description ?? "",
      imageUrl: uploadedImage.url,
      imageKey: uploadedImage.key,
    });

    return toDto(newMaterial);
  } catch (error) {
    if (uploadedImage) {
      await deleteFile(uploadedImage.key);
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CustomError(
        409,
        `Material with name '${data.name}' already exists.`,
      );
    }
    throw error;
  }
};

export const updateMaterial = async (
  id: string,
  data: UpdateMaterialBody,
): Promise<MaterialDto> => {
  const foundMaterial = await materialRepo.getMaterialById(id);

  if (!foundMaterial) {
    throw new CustomError(404, `Material not found with ID: ${id}.`);
  }

  const updatedMaterial = await materialRepo.updateMaterial(id, data);
  return toDto(updatedMaterial);
};

export const deleteMaterial = async (id: string) => {
  try {
    const deleted = await materialRepo.deleteMaterial(id);
    await deleteFile(deleted.imageKey);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new CustomError(404, "Material not found");
    }
    throw error;
  }
};
