import z from "zod";
import { ApiResponse, PaginatedResponse } from "../../common/api.js";
import { Gender, Role } from "../../generated/prisma/enums.js";
import { createRecord, deleteRecord, getRecordsQuery, updateRecord } from './record.schema.js';

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
export type UpdateRecordBody = z.infer<typeof updateRecord.body>;
export type UpdateRecordParams = z.infer<typeof updateRecord.params>;
export type DeleteRecordParams = z.infer<typeof deleteRecord.params>;

// RESPONSE
export type GetRecordsResponse = ApiResponse<PaginatedResponse<RecordDto>>;
export type CreateRecordResponse = ApiResponse<RecordDto>;