import z from "zod";
import { MainCategory, RewardItemType, Unit } from "../../../generated/prisma/enums.js";

export const rewardItemParams = {
  params: z.object({
    id: z.uuid("Invalid Reward Item Id."),
  }),
};

export const createRewardItem = {
  body: z.object({
    name: z
      .string("Reward item name is required.")
      .min(1, "Reward item name cannot be empty."),
    description: z
      .string("Description is required.")
      .min(1, "Description cannot be empty."),
    itemType: z.enum([RewardItemType.PRODUCT, RewardItemType.FARM], {
      message: "Item type must be either PRODUCT or FARM.",
    }),
    mainCategory: z.enum(
      [MainCategory.AGRICULTURAL, MainCategory.NON_AGRICULTURAL],
      {
        message: "Main category must be either AGRICULTURAL or NON_AGRICULTURAL.",
      }
    ),
    subCategory: z.string().optional(),
    requiredPoints: z.coerce
      .number("Required points must be a number.")
      .int("Required points must be an integer.")
      .min(1, "Required points must be at least 1."),
    unit: z.enum([Unit.KG, Unit.PIECE, Unit.BUNDLE, Unit.SACK, Unit.POT], {
      message: "Unit must be one of: KG, PIECE, BUNDLE, SACK, POT.",
    }),
    farmOrigin: z.string().optional(),
    stocks: z.coerce
      .number("Stocks must be a number.")
      .int("Stocks must be an integer.")
      .min(0, "Stocks cannot be negative.")
      .optional(),
  }),
};

export const updateRewardItem = {
  params: rewardItemParams.params,
  body: z.object({
    name: z
      .string("Reward item name is required.")
      .min(1, "Reward item name cannot be empty.")
      .optional(),
    description: z
      .string("Description is required.")
      .min(1, "Description cannot be empty.")
      .optional(),
    itemType: z.enum([RewardItemType.PRODUCT, RewardItemType.FARM], {
      message: "Item type must be either PRODUCT or FARM.",
    }).optional(),
    mainCategory: z.enum(
      [MainCategory.AGRICULTURAL, MainCategory.NON_AGRICULTURAL],
      {
        message: "Main category must be either AGRICULTURAL or NON_AGRICULTURAL.",
      }
    ).optional(),
    subCategory: z.string().optional(),
    requiredPoints: z.coerce
      .number("Required points must be a number.")
      .int("Required points must be an integer.")
      .min(1, "Required points must be at least 1.")
      .optional(),
    unit: z.enum([Unit.KG, Unit.PIECE, Unit.BUNDLE, Unit.SACK, Unit.POT], {
      message: "Unit must be one of: KG, PIECE, BUNDLE, SACK, POT.",
    }).optional(),
    farmOrigin: z.string().optional(),
    stocks: z.coerce
      .number("Stocks must be a number.")
      .int("Stocks must be an integer.")
      .min(0, "Stocks cannot be negative.")
      .optional(),
  }),
};
