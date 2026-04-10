import z from "zod";
import { createSubdivision } from "./subdivision.schema.js";
import { ApiResponse } from "../../common/api.js";

export interface SubdivisionDto {
  id: string;
  name: string;
  area: number;
}

// Request
export type CreateSubdivisionBody = z.infer<typeof createSubdivision.body>;

// Response
export type createSubdivisionResponse = ApiResponse<SubdivisionDto>;
