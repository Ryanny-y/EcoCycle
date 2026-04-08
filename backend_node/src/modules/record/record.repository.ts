import { prisma } from "../../config/prisma";
import { RecordCreateInput, RecordWhereInput } from "../../generated/prisma/models";
import { CreateRecordBody } from "./record.types";

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