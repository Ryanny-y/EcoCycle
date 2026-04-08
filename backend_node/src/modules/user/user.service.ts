import { User } from "../../generated/prisma/client.js";
import { SignupBody } from "../auth/auth.types.js";
import * as userRepo from "./user.repository.js";
import bcrypt from "bcrypt";

export const registerUser = async (data: SignupBody): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return userRepo.createUser({
    username: data.username,
    email: data.email,
    passwordHash: hashedPassword,
    role: data.role,
  });
};
