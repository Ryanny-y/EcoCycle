import z from "zod";
import { ApiResponse, PaginatedResponse } from "../../common/api";
import { Gender, Role } from "../../generated/prisma/enums";
import { getRecordsQuery } from './record.schema';

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


// RESPONSE
export type GetRecordsResponse = ApiResponse<PaginatedResponse<RecordDto>>;