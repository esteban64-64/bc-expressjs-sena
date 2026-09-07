import { z } from "zod";

/**
 * Schemas Zod para validación de aprendices SENA.
 * Tipos TypeScript inferidos con z.infer<>.
 */

export const crearAprendizSchema = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es obligatorio").trim(),
  documento: z.string().min(5, "El documento debe tener al menos 5 caracteres").trim(),
  programId: z.string().uuid("programId debe ser un UUID válido"),
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
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export const paginacionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// Tipos inferidos de Zod
export type CrearAprendizInput = z.infer<typeof crearAprendizSchema>;
export type ActualizarAprendizInput = z.infer<typeof actualizarAprendizSchema>;
