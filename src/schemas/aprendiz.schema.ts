import { z } from "zod";

/**
 * Schemas Zod para validación de aprendices SENA.
 * `programa` se valida como ObjectId (24 hex chars) de MongoDB.
 */

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const crearAprendizSchema = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es obligatorio").trim(),
  documento: z.string().min(5, "El documento debe tener al menos 5 caracteres").trim(),
  programa: z.string().regex(objectIdRegex, "programa debe ser un ObjectId válido"),
  ficha: z.string().min(1, "La ficha es obligatoria").trim(),
  estado: z.enum(["activo", "retirado", "graduado"], {
    errorMap: () => ({ message: "Estado inválido. Debe ser: activo, retirado, graduado" }),
  }),
  fechaIngreso: z.coerce.date({ errorMap: () => ({ message: "fechaIngreso debe ser una fecha válida (YYYY-MM-DD)" }) }),
  promedioAcumulado: z.number().min(0, "El promedio mínimo es 0").max(5, "El promedio máximo es 5"),
  costoMatricula: z.number().positive("El costo de matrícula debe ser mayor a 0"),
});

export const actualizarAprendizSchema = crearAprendizSchema.partial();

export const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, "El ID debe ser un ObjectId válido"),
});

export const paginacionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().min(1).optional(),
});

// Tipos inferidos de Zod
export type CrearAprendizInput = z.infer<typeof crearAprendizSchema>;
export type ActualizarAprendizInput = z.infer<typeof actualizarAprendizSchema>;
