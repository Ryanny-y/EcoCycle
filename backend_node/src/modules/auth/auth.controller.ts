import { NextFunction, Request, Response } from "express";
import * as authService from "./auth.service";
import asyncHandler from "express-async-handler";
import {
  LoginBody,
  LoginResponse,
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

    res.cookie("refresh-token", loginData.refreshToken as string, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/api/auth",
    });

    res.json({
      message: "Login Successful.",
      success: true,
      data: loginData,
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
