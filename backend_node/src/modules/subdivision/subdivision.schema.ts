import z from "zod";

export const subdivisionParams = {
  params: z.object({
    area: z.coerce.number("Area must be a number.").min(1, "Area is required."),
  }),
};

export const createSubdivision = {
  body: z.object({
    name: z.string("Subdivision name is required."),
    area: z.coerce.number("Area must be a number.").min(1, "Area is required."),
  }),
};
