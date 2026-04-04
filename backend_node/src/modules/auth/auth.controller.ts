import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import asyncHandler from "express-async-handler";
import {
  LoginBody,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  SignupBody,
  SignupResponse,
} from "./auth.types";

export const login = asyncHandler(
  async (
    req: Request<{}, {}, LoginBody>,
    res: Response<LoginResponse>,
    next: NextFunction,
  ) => {
    const loginData = await authService.login(req.body);

    res.cookie("refresh_token", loginData.refreshToken as string, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/api/auth",
    });

    res.json({
      message: "Login Successful.",
      success: true,
      data: {
        accessToken: loginData.accessToken,
        userData: loginData.userData,
      },
    });
  },
);

export const signup = asyncHandler(
  async (
    req: Request<{}, {}, SignupBody>,
    res: Response<SignupResponse>,
    next: NextFunction,
  ) => {
    const createdUser = await authService.signup(req.body);
    res.status(201).json({
      message: "User Created Successfully.",
      success: true,
      data: createdUser,
    });
  },
);

export const refreshToken = asyncHandler(
  async (
    req: Request,
    res: Response<RefreshTokenResponse>,
    next: NextFunction,
  ) => {
    const { cookies } = req;
    const { refresh_token } = cookies;
    
    const refreshResponse = await authService.refreshToken(refresh_token);

    res.json({
      success: true,
      message: "Access Token Refreshed",
      data: refreshResponse,
    });
  },
);

export const logout = asyncHandler(
  async (req: Request, res: Response<LogoutResponse>, next: NextFunction) => {
    const { cookies } = req;
    const { refresh_token } = cookies;

    authService.logout(refresh_token);

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/api/auth",
    });

    res.json({
      success: true,
      message: "Logged out successfully.",
    });
  },
);
