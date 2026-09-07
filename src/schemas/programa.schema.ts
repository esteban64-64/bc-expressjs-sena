import { z } from "zod";

/**
 * Schemas Zod para la entidad secundaria: Programa.
 */

export const objectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
});

export const crearProgramaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(150).trim(),
  nivel: z.enum(["Tecnólogo", "Técnico", "Auxiliar"], {
    errorMap: () => ({ message: "nivel debe ser: Tecnólogo, Técnico o Auxiliar" }),
  }),
  duracionMeses: z.number().int().positive("duracionMeses debe ser mayor a 0"),
});

export const actualizarProgramaSchema = crearProgramaSchema.partial();

export type CrearProgramaInput = z.infer<typeof crearProgramaSchema>;
export type ActualizarProgramaInput = z.infer<typeof actualizarProgramaSchema>;
