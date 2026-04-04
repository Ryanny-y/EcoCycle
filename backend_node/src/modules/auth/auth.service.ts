import { LoginBody, LoginDto, SignupBody } from "./auth.types";
import { CustomError } from "../../middlewares/errorHandler";
import * as userRepo from "../user/user.repository";
import * as userService from "../user/user.service"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addDays } from "date-fns";
import { User } from "../../generated/prisma/client";
import { UserDto } from "../user/user.types";
import { mapToDto } from "../user/user.mapper";

export const login = async (data: LoginBody): Promise<LoginDto> => {
  const { username, password } = data;

  const foundUser = await userRepo.findByUsername(username.toLowerCase());

  const passwordHash = foundUser?.passwordHash || '$2b$10$CwTycUXWue0Thq9StjUM0uJ8xG9.KqH6B1aD0K7wVfP5a0Nf2r4a'

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
  const { username, password, confirmPassword } = data;

  const foundUser = await userRepo.findByUsername(username.toLowerCase());
  if(foundUser) throw new CustomError(409, `User with ${username} already exists.`);

  if(password !== confirmPassword) throw new CustomError(400, `Password and Confirm Password does not match.`);

  const createdUser = await userService.registerUser(data);

  return mapToDto(createdUser);
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
