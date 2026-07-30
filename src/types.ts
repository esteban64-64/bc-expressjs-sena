/**
 * Tipos del dominio SENA — Centro de Formación
 * Recurso principal: Apprentice (Aprendiz)
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
}

export type CreateApprenticeDto = Omit<Apprentice, "id">;
export type UpdateApprenticeDto = Partial<CreateApprenticeDto>;
