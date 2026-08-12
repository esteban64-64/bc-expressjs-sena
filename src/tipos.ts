/**
 * Tipos del dominio SENA — Centro de Formación
 * Recurso principal: Apprentice (Aprendiz)
 */

// ─── Entidad principal ───
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

// ─── DTOs ───
export type CrearAprendizDto = Omit<Apprentice, "id" | "createdAt">;
export type ActualizarAprendizDto = Partial<CrearAprendizDto>;

// ─── Contratos de respuesta ───
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
}

// ─── Opciones de paginación ───
export interface OpcionesPaginacion {
  page: number;
  limit: number;
}
