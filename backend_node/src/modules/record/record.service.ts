import { GetRecordsQuery, RecordDto } from "./record.types";
import * as recordRepo from "./record.repository";
import { RecordWhereInput } from "../../generated/prisma/models";
import { PaginatedResponse } from "../../common/api";
import { Record } from "../../generated/prisma/client";
import { toDto } from "./record.mapper";

export const getRecords = async (
  query: GetRecordsQuery,
): Promise<PaginatedResponse<RecordDto>> => {
  const { isResident, search, page = "0", size = "10" } = query;
  const pageNumber = parseInt(page as string, 10);
  const sizeNumer = parseInt(size as string, 10);

  const where: RecordWhereInput = {};

  if (isResident !== undefined) {
    where.isResident = isResident;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { middleName: { contains: search, mode: "insensitive" } },
    ];
  }

  const totalItems = await recordRepo.getRecordCount(where);
  const records = await recordRepo.getRecords(where, pageNumber, sizeNumer);
  const totalPages = Math.ceil(totalItems / sizeNumer);

  const pageContent = records.map(record => toDto(record));

  return {
    content: pageContent,
    page: pageNumber,
    size: sizeNumer,
    totalItems,
    totalPages,
    first: pageNumber === 0,
    last: pageNumber + 1 >= totalPages,
  };
};
