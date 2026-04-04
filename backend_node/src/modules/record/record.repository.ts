import { prisma } from "../../config/prisma";
import { RecordWhereInput } from "../../generated/prisma/models";

export const getRecordCount = async (
  where: RecordWhereInput,
): Promise<number> => {
  return await prisma.record.count({
    where,
  });
};

export const getRecords = async (
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
