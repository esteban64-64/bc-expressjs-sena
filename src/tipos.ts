/**
 * Tipos del dominio SENA — Centro de Formación
 */

export interface Apprentice {
  id: number;
  nombre_completo: string;
  documento: string;
  programa_id: number;
  ficha: string;
  estado: "activo" | "retirado" | "graduado";
  fecha_ingreso: string;
  promedio_acumulado: number;
  costo_matricula: number;
  createdAt: string;
}

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
