import { prisma } from "../../config/prisma.js";
import {
  RecordCreateInput,
  RecordUpdateInput,
  RecordWhereInput,
} from "../../generated/prisma/models.js";

export const getRecordCount = async (
  where: RecordWhereInput,
): Promise<number> => {
  return await prisma.record.count({
    where,
  });
};

export const getPaginatedRecords = async (
  where: RecordWhereInput,
  page: number,
  size: number,
) => {
  return await prisma.record.findMany({
    where,
    skip: page * size,
    take: size,
    include: {
      subdivision: true,
    },
    orderBy: { lastName: "asc" },
  });
};

export const getRecordById = (id: string) => {
  return prisma.record.findUnique({ where: { id } });
};

export const getRecordByFilter = (where: RecordWhereInput) => {
  return prisma.record.findFirst({ where });
};

export const createRecord = (data: RecordCreateInput) => {
  return prisma.record.create({ data });
};

export const updateRecord = (id: string, data: RecordUpdateInput) => {
  return prisma.record.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteRecord = async (id: string) => {
  await prisma.record.delete({
    where: {
      id,
    },
  });
};
