import type { ApiResponse } from "@/types/api";
import type { IMaterial } from "@/types/material.types";

export type SortOrder = "ASC" | "DESC";
export type SortField = "createdAt" | "name" | "pointsPerKg";

export interface MaterialContextType {
  data: ApiResponse<IMaterial[]> | null;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  setSearch: (search: string) => void;
  sortField: SortField,
  setSortField: (option: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  resetFilters: () => void;
}