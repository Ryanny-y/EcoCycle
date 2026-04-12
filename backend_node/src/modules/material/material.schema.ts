import z from "zod";
import { uploadedFileSchema } from "../../infra/storage/storage.types.js";

export const materialParams = {
  params: z.object({
    id: z.uuid("Invalid Material Id."),
  }),
};

export const createMaterial = {
  body: z.object({
    name: z
      .string("Material name is required.")
      .min(1, "Material name cannot be empty."),
    description: z.string().optional(),
    pointsPerKg: z.coerce
      .number("Points per kg must be a number.")
      .int("Points per kg must be an integer.")
      .min(1, "Points per kg must be at least 1."),
  }),
  file: uploadedFileSchema,
};

export const updateMaterial = {
  params: materialParams.params,
  body: z.object({
    name: z
      .string()
      .optional(),
    description: z
      .string()
      .optional(),
    pointsPerKg: z.coerce
      .number()
      .optional(),
  }),
  file: uploadedFileSchema.optional(),
};
