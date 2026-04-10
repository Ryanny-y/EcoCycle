import {
  CreateRecordBody,
  GetRecordsQuery,
  RecordDto,
} from "./record.types.js";
import * as recordRepo from "./record.repository.js";
import { RecordWhereInput } from "../../generated/prisma/models.js";
import { PaginatedResponse } from "../../common/api.js";
import { toDto } from "./record.mapper.js";
import { CustomError } from "../../middlewares/errorHandler.js";
import { Record } from "../../generated/prisma/client.js";

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
  const records = await recordRepo.getPaginatedRecords(
    where,
    pageNumber,
    sizeNumer,
  );
  const totalPages = Math.ceil(totalItems / sizeNumer);

  const pageContent = records.map((record: Record) => toDto(record));

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

export const createRecord = async (
  data: CreateRecordBody,
): Promise<RecordDto> => {
  const { subdivisionId, ...rest } = data;

  const foundRecord = await recordRepo.getRecordByFilter({
    firstName: data.firstName,
    ...(data.middleName && { middleName: data.middleName }),
    lastName: data.lastName,
  });

  if (foundRecord) {
    throw new CustomError(409, "Record with ");
  }

  const newRecord = await recordRepo.createRecord({
    ...rest,

    middleName: rest.middleName ?? null,
    suffix: rest.suffix ?? null,
    birthDate: rest.birthDate ? new Date(rest.birthDate) : null,
    address: rest.address ?? null,
    contactNumber: rest.contactNumber ?? null,

    subdivision: {
      connect: { id: subdivisionId },
    },
  });

  return toDto(newRecord);
};

export const updateRecord = async (
  id: string,
  data: Partial<CreateRecordBody>,
): Promise<RecordDto> => {
  const { subdivisionId, ...rest } = data;

  const updateData = {
    ...(rest.firstName !== undefined && { firstName: rest.firstName }),
    ...(rest.lastName !== undefined && { lastName: rest.lastName }),
    ...(rest.gender !== undefined && { gender: rest.gender }),
    ...(rest.isResident !== undefined && { isResident: rest.isResident }),
    ...(rest.role !== undefined && { role: rest.role }),

    ...(rest.middleName !== undefined && {
      middleName: rest.middleName ?? null,
    }),

    ...(rest.suffix !== undefined && {
      suffix: rest.suffix ?? null,
    }),

    ...(rest.birthDate !== undefined && {
      birthDate: rest.birthDate ? new Date(rest.birthDate) : null,
    }),

    ...(rest.address !== undefined && {
      address: rest.address ?? null,
    }),

    ...(rest.contactNumber !== undefined && {
      contactNumber: rest.contactNumber ?? null,
    }),

    ...(subdivisionId !== undefined && {
      subdivision: {
        connect: { id: subdivisionId },
      },
    }),
  };

  const updatedRecord = await recordRepo.updateRecord(id, updateData);

  return toDto(updatedRecord);
};
