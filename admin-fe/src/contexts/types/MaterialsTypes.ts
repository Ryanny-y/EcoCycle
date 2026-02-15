import type { ApiResponse } from "@/types/api";
import type { Material } from "@/types/dto";

export type SortOrder = "ASC" | "DESC";
export type SortField = "createdAt" | "name" | "pointsPerKg";

export interface MaterialContextType {
  data: ApiResponse<Material[]> | null;
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