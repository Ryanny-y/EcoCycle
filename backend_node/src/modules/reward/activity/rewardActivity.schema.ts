import { Decimal } from "decimal.js";
import z from "zod";

const materialInput = z.object({
  id: z.uuid("Invalid material ID."),
  weight: z
    .string("Weight is required.")
    .regex(/^\d{1,8}(\.\d{1,2})?$/, "Weight must be a valid decimal number with up to 2 decimal places.")
    .transform((val) => new Decimal(val)),
});

export const earnPoints = {
  body: z.object({
    materials: z
      .array(materialInput)
      .min(1, "At least one material is required."),
  }),
};
