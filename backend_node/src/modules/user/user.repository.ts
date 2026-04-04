import { prisma } from "../../config/prisma";
import { UserCreateInput, UserUpdateInput } from "../../generated/prisma/models";

export const findByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

export const updateUser = async (id: string, data: UserUpdateInput) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const createUser = async (data: UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};