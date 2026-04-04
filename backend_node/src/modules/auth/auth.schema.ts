import { z } from "zod";
import { UserRole } from "../../generated/prisma/enums";

export const loginSchema = {
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
};

export const signupSchema = {
  body: z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(30, { message: "Username must be at most 30 characters long." }),
    email: z.email({ message: "Please provide a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(128, {
        message: "Password must be at most 128 characters long.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(128, {
        message: "Password must be at most 128 characters long.",
      }),
    role: z.enum([UserRole.ADMIN, UserRole.SUPER_ADMIN], {
      message: "Role must be either 'user' or 'admin'.",
    }),
  }),
};
