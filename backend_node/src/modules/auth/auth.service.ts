import { LoginBody, LoginDto } from "./auth.types";
import { CustomError } from "../../middlewares/errorHandler";
import * as userRepo from "../user/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addDays } from "date-fns";
import { User } from "../../generated/prisma/client";

export const login = async (data: LoginBody): Promise<LoginDto> => {
  const { username, password } = data;

  const foundUser = await userRepo.findUser(username.toLowerCase());

  if (!foundUser)
    throw new CustomError(401, `Username or password is incorrect.`);

  const match = await bcrypt.compare(password, foundUser.passwordHash);
  if (!match) throw new CustomError(401, `Username or password is incorrect.`);

  const accessToken = generateAccessToken(foundUser);

  const refreshToken = generateAccessToken(foundUser);

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
