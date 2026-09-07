/**
 * Tipos del dominio SENA — Centro de Formación
 */

export interface RespuestaPaginada<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface RespuestaIndividual<T> {
  data: T;
}

export interface RespuestaError {
  error: string;
  message: string;
  issues?: Array<{ path: (string | number)[]; message: string }>;
}
