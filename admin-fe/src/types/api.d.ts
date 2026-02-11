export interface PaginatedResponse<T> {
  content: T[]; 
  page: int;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}