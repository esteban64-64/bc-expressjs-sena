import { Schema, model, type InferSchemaType } from "mongoose";

/**
 * Entidad secundaria (sin referencias): Program (programa de formación).
 * Colección: "programs".
 */
const programaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del programa es requerido"],
      trim: true,
      unique: true,
      maxlength: 150,
    },
    nivel: {
      type: String,
      required: [true, "El nivel es requerido"],
      enum: ["Tecnólogo", "Técnico", "Auxiliar"],
    },
    duracionMeses: {
      type: Number,
      required: [true, "La duración en meses es requerida"],
      min: 1,
    },
  },
  { timestamps: true, collection: "programs" }
);

export type Programa = InferSchemaType<typeof programaSchema>;
export const Programa = model("Programa", programaSchema);
