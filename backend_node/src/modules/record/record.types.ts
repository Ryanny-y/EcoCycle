import z from "zod";
import { ApiResponse, PaginatedResponse } from "../../common/api";
import { Gender, Role } from "../../generated/prisma/enums";
import { createRecord, getRecordsQuery } from './record.schema';

// DTO
export interface RecordDto {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  birthDate?: string;

  gender: Gender;

  isResident?: boolean;
  role?: Role;

  address?: string;
  contactNumber?: string;

  subdivisionId: string;

  points?: number;

  createdAt: string;
  updatedAt: string;
}

// REQUEST
export type GetRecordsQuery = z.infer<typeof getRecordsQuery.query>;
export type CreateRecordBody = z.infer<typeof createRecord.body>;

// RESPONSE
export type GetRecordsResponse = ApiResponse<PaginatedResponse<RecordDto>>;
export type CreateRecordResponse = ApiResponse<RecordDto>;