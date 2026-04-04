export type ApiResponse<T> = {
  data?: T;
  message?: string;
  success?: boolean;
};

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};
