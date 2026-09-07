import mongoose from "mongoose";
import { Programa } from "../modelos/programa.modelo.js";
import { AppError } from "../errors/AppError.js";
import type { CrearProgramaInput, ActualizarProgramaInput } from "../schemas/programa.schema.js";

function esErrorDuplicado(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000;
}

export async function obtenerTodos(): Promise<unknown[]> {
  return Programa.find().sort({ nombre: 1 }).lean();
}

export async function obtenerPorId(id: string): Promise<unknown> {
  try {
    const programa = await Programa.findById(id).lean();
    if (!programa) throw new AppError(404, "Programa no encontrado");
    return programa;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, "ID inválido");
    throw err;
  }
}

export async function crear(datos: CrearProgramaInput): Promise<unknown> {
  try {
    const programa = await Programa.create(datos);
    return programa.toJSON();
  } catch (err) {
    if (esErrorDuplicado(err)) throw new AppError(409, "Ya existe un programa con ese nombre");
    throw err;
  }
}

export async function actualizar(id: string, datos: ActualizarProgramaInput): Promise<unknown> {
  try {
    const programa = await Programa.findByIdAndUpdate(id, datos, { returnDocument: "after", runValidators: true }).lean();
    if (!programa) throw new AppError(404, "Programa no encontrado");
    return programa;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, "ID inválido");
    if (esErrorDuplicado(err)) throw new AppError(409, "Ya existe un programa con ese nombre");
    throw err;
  }
}

export async function eliminar(id: string): Promise<void> {
  try {
    const programa = await Programa.findByIdAndDelete(id).lean();
    if (!programa) throw new AppError(404, "Programa no encontrado");
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, "ID inválido");
    throw err;
  }
}
