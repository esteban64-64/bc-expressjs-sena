import { Schema, model, type InferSchemaType } from "mongoose";

/**
 * Entidad principal (con referencia a la secundaria): Apprentice (aprendiz).
 * Colección: "apprentices". Campo de referencia: `programa` → Programa.
 */
const aprendizSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      trim: true,
      maxlength: 150,
    },
    documento: {
      type: String,
      required: [true, "El documento es requerido"],
      trim: true,
      unique: true,
    },
    ficha: {
      type: String,
      required: [true, "La ficha es requerida"],
      trim: true,
    },
    estado: {
      type: String,
      required: true,
      enum: ["activo", "retirado", "graduado"],
      default: "activo",
    },
    fechaIngreso: {
      type: Date,
      required: [true, "La fecha de ingreso es requerida"],
    },
    promedioAcumulado: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    costoMatricula: {
      type: Number,
      required: true,
      min: 0,
    },
    programa: {
      type: Schema.Types.ObjectId,
      ref: "Programa",
      required: [true, "El programa es requerido"],
    },
    // ID del usuario que registró al aprendiz — permite que su propio
    // registrador (rol "user") lo edite; solo "admin" puede eliminar.
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "apprentices" }
);

export type Aprendiz = InferSchemaType<typeof aprendizSchema>;
export const Aprendiz = model("Aprendiz", aprendizSchema);
