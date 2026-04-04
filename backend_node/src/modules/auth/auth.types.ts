import z from "zod";
import { loginSchema, signupSchema } from "./auth.schema";
import { ApiResponse } from "../../common/api";
import { UserDto } from "../user/user.types";

// DTO
export interface AuthDto {
  accessToken: string,
  refreshToken?: string;
  userData: UserDto
}

// Request
export type LoginBody = z.infer<typeof loginSchema.body>;
export type SignupBody = z.infer<typeof signupSchema.body>;

// Response
export type LoginResponse = ApiResponse<AuthDto>;
export type SignupResponse = ApiResponse<UserDto>;
export type RefreshTokenResponse = ApiResponse<AuthDto>;
export type LogoutResponse = ApiResponse<void>;