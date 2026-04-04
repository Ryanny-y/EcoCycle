import z from "zod";

export const getRecordsQuery = {
  query: z.object({
    isResident: z.boolean().optional(),
    search: z.string().optional(),
    size: z.string().optional(),
    page: z.string().optional()
  }),
};