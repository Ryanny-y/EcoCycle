import z from "zod";

export const loginSchema = {
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
};
