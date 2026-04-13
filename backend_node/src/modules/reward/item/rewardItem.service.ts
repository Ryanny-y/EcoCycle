import {
  CreateRewardItemBody,
  RewardItemDto,
  UpdateRewardItemBody,
} from "./rewardItem.types.js";
import * as rewardItemRepo from "./rewardItem.repository.js";
import { toDto } from "./rewardItem.mapper.js";
import { CustomError } from "../../../middlewares/errorHandler.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { MulterType } from "../../../infra/storage/storage.types.js";
import { deleteFile, uploadFile } from "../../../infra/storage/s3.service.js";

export const getRewardItems = async (): Promise<RewardItemDto[]> => {
  const rewardItems = await rewardItemRepo.getAllRewardItems();
  return rewardItems.map((item) => toDto(item));
};

export const getRewardItem = async (id: string): Promise<RewardItemDto> => {
  const rewardItem = await rewardItemRepo.getRewardItemById(id);

  if (!rewardItem) {
    throw new CustomError(404, `Reward item not found with ID: ${id}.`);
  }

  return toDto(rewardItem);
};

export const createRewardItem = async (
  data: CreateRewardItemBody,
  file?: MulterType,
): Promise<RewardItemDto> => {
  let uploadedImage;
  try {
    let imageUrl: string | undefined;
    let imageKey: string | undefined;

    if (file) {
      uploadedImage = await uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        "reward-items",
      );
      imageUrl = uploadedImage.url;
      imageKey = uploadedImage.key;
    }

    const newRewardItem = await rewardItemRepo.createRewardItem({
      ...data,
      subCategory: data.subCategory ?? null,
      farmOrigin: data.farmOrigin ?? null,
      stocks: data.stocks ?? 0,
      imageUrl: imageUrl ?? null,
      imageKey: imageKey ?? null,
    });

    return toDto(newRewardItem);
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
        `Reward item with name '${data.name}' already exists.`,
      );
    }
    throw error;
  }
};

export const updateRewardItem = async (
  id: string,
  data: UpdateRewardItemBody,
  file?: MulterType,
): Promise<RewardItemDto> => {
  let uploadedImage;
  let oldImageKey: string | null = null;

  try {
    const foundRewardItem = await rewardItemRepo.getRewardItemById(id);

    if (!foundRewardItem) {
      throw new CustomError(404, `Reward item not found with ID: ${id}.`);
    }

    let imageUrl = foundRewardItem.imageUrl;
    let imageKey = foundRewardItem.imageKey;

    if (file) {
      uploadedImage = await uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        "reward-items",
      );

      imageUrl = uploadedImage.url;
      imageKey = uploadedImage.key;

      oldImageKey = foundRewardItem.imageKey;
    }

    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    const updatedRewardItem = await rewardItemRepo.updateRewardItem(id, {
      ...cleanedData,
      imageUrl,
      imageKey,
    });

    if (oldImageKey && oldImageKey !== imageKey) {
      await deleteFile(oldImageKey);
    }

    return toDto(updatedRewardItem);
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
        `Reward item with name '${data.name}' already exists.`,
      );
    }
    throw error;
  }
};

export const deleteRewardItem = async (id: string) => {
  try {
    const deleted = await rewardItemRepo.deleteRewardItem(id);
    if (deleted.imageKey) {
      await deleteFile(deleted.imageKey);
    }
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new CustomError(404, "Reward item not found");
    }
    throw error;
  }
};
