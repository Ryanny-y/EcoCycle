import { prisma } from "../../config/prisma";

export const findUser = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  });
};

export const updateUser = async (id: string, data: any) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};
