// Página de resultados (PageResponseDto de z4-shared-core).
export interface PageResponseDTO<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
