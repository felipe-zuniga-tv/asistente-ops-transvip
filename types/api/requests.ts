export interface PaginationRequest {
  page: number;
  limit: number;
}

export interface SearchRequest {
  query: string;
  filters?: Record<string, any>;
}
