import { z } from "zod";
import { UserRole } from "../../generated/prisma/enums";

export const loginSchema = {
  body: z.object({
    username: z.string("Username is required."),
    password: z.string("Password is required."),
  }),
};

export const signupSchema = {
  body: z.object({
    username: z
      .string("Username is required.")
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(30, { message: "Username must be at most 30 characters long." }),
    email: z.email({ message: "Please provide a valid email address." }),
    password: z
      .string("Password is required")
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(128, {
        message: "Password must be at most 128 characters long.",
      }),
    confirmPassword: z
      .string("Confirm Password is required")
      .min(8, {
        message: "Confirm Password must be at least 8 characters long.",
      })
      .max(128, {
        message: "Confirm Password must be at most 128 characters long.",
      }),
    role: z.enum([UserRole.ADMIN, UserRole.SUPER_ADMIN], {
      message: "Role must be either 'ADMIN' or 'SUPER_ADMIN'.",
    }),
  }),
};

export const refreshTokenSchema = {
  cookies: z.object({
    refreshToken: z.string("Refresh Token is required."),
  }),
};