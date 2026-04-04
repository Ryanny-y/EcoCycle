import { LoginBody, AuthDto, SignupBody } from "./auth.types";
import { CustomError } from "../../middlewares/errorHandler";
import * as userRepo from "../user/user.repository";
import * as userService from "../user/user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addDays } from "date-fns";
import { User } from "../../generated/prisma/client";
import { UserDto } from "../user/user.types";
import { mapToDto } from "../user/user.mapper";

export const login = async (data: LoginBody): Promise<AuthDto> => {
  const { username, password } = data;

  const foundUser = await userRepo.findByUsername(username);

  const passwordHash =
    foundUser?.passwordHash ||
    "$2b$10$CwTycUXWue0Thq9StjUM0uJ8xG9.KqH6B1aD0K7wVfP5a0Nf2r4a";

  const match = await bcrypt.compare(password, passwordHash);

  if (!foundUser || !match)
    throw new CustomError(401, `Username or password is incorrect.`);

  const accessToken = generateAccessToken(foundUser);

  const refreshToken = generateRefreshToken(foundUser);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await userRepo.updateUser(foundUser.id, {
    refreshTokenHash: hashedRefreshToken,
    refreshTokenExp: addDays(new Date(), 7),
  });

  return {
    userData: {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
    },
    accessToken,
    refreshToken,
  };
};

export const signup = async (data: SignupBody): Promise<UserDto> => {
  const { username, email, password, confirmPassword } = data;

  const foundUser = await userRepo.findUserByEmailOrUsername(
    email.toLowerCase(),
    username.toLowerCase(),
  );

  if (foundUser) {
    if (foundUser.username.toLowerCase() === data.username.toLowerCase()) {
      throw new CustomError(
        409,
        `User with username '${data.username}' already exists.`,
      );
    }
    if (foundUser.email.toLowerCase() === data.email.toLowerCase()) {
      throw new CustomError(
        409,
        `User with email '${data.email}' already exists.`,
      );
    }
  }

  if (password !== confirmPassword)
    throw new CustomError(400, `Password and Confirm Password does not match.`);

  const createdUser = await userService.registerUser(data);

  return mapToDto(createdUser);
};

export const refreshToken = async (refreshToken: string): Promise<AuthDto> => {
  let payload: any;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    throw new CustomError(401, "Unauthorized");
  }

  const foundUser = await userRepo.findById(payload.sub);

  if (!foundUser || !foundUser?.refreshTokenHash)
    throw new CustomError(401, "Unauthorized");

  const isSameToken = await bcrypt.compare(
    refreshToken,
    foundUser.refreshTokenHash,
  );

  if (
    !foundUser.refreshTokenExp ||
    !isSameToken ||
    foundUser.refreshTokenExp.getTime() < Date.now()
  ) {
    throw new CustomError(401, "Unauthorized");
  }

  const newAccessToken = jwt.sign(
    {
      sub: foundUser.id,
      role: foundUser.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );

  return {
    userData: mapToDto(foundUser),
    accessToken: newAccessToken,
  };
};

export const logout = async (refreshToken: string) => {
  let payload: any;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    return;
  }

  const foundUser = await userRepo.findById(payload.sub);

  if(!foundUser || !foundUser.refreshTokenHash) return;

  const isValid = await bcrypt.compare(refreshToken, foundUser.refreshTokenHash);
  if(!isValid) return;

  await userRepo.updateUser(foundUser.id, {
    refreshTokenHash: null,
    refreshTokenExp: null,
  })
};

const generateAccessToken = (user: User) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );
};
const generateRefreshToken = (user: User) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" },
  );
};
