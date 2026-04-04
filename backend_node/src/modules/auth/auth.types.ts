import z from "zod";
import { loginSchema } from "./auth.schema";
import { ApiResponse } from "../../common/api";
import { UserRole } from "../../generated/prisma/enums";

// DTO
export interface LoginDto {
  accessToken: string,
  refreshToken?: string;
  userData: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

// Request
export type LoginBody = z.infer<typeof loginSchema.body>;

// Response
export type LoginResponse = ApiResponse<LoginDto>;
