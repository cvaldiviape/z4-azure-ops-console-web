// Formato común de todas las respuestas del backend (ResponseDto de z4-shared-core).
export interface ResponseDTO<T> {
  code: string;
  statusCode: number;
  message: string;
  data: T;
}
