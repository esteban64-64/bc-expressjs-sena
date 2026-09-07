import mongoose from "mongoose";
import { Aprendiz } from "../modelos/aprendiz.modelo.js";
import { AppError } from "../errors/AppError.js";
import type { CrearAprendizInput, ActualizarAprendizInput } from "../schemas/aprendiz.schema.js";

export interface ResultadoPaginado<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

function esErrorDuplicado(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000;
}

export async function obtenerTodos(page: number, limit: number, search?: string): Promise<ResultadoPaginado<unknown>> {
  const skip = (page - 1) * limit;
  const filtro = search ? { nombreCompleto: { $regex: search, $options: "i" } } : {};

  const [data, total] = await Promise.all([
    Aprendiz.find(filtro)
      .populate("programa")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Aprendiz.countDocuments(filtro),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function obtenerPorId(id: string): Promise<unknown> {
  try {
    const aprendiz = await Aprendiz.findById(id).populate("programa").lean();
    if (!aprendiz) throw new AppError(404, "Aprendiz no encontrado");
    return aprendiz;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, "ID inválido");
    throw err;
  }
}

export async function crear(datos: CrearAprendizInput, createdBy: string): Promise<unknown> {
  try {
    const aprendiz = await Aprendiz.create({ ...datos, createdBy });
    return aprendiz.toJSON();
  } catch (err) {
    if (esErrorDuplicado(err)) throw new AppError(409, "Ya existe un aprendiz con ese documento");
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, "programa debe ser un ObjectId válido");
    throw err;
  }
}

export async function actualizar(id: string, datos: ActualizarAprendizInput): Promise<unknown> {
  try {
    const aprendiz = await Aprendiz.findByIdAndUpdate(id, datos, { returnDocument: "after", runValidators: true })
      .populate("programa")
      .lean();
    if (!aprendiz) throw new AppError(404, "Aprendiz no encontrado");
    return aprendiz;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, "ID inválido");
    if (esErrorDuplicado(err)) throw new AppError(409, "Ya existe un aprendiz con ese documento");
    throw err;
  }
}

export async function eliminar(id: string): Promise<void> {
  try {
    const aprendiz = await Aprendiz.findByIdAndDelete(id).lean();
    if (!aprendiz) throw new AppError(404, "Aprendiz no encontrado");
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, "ID inválido");
    throw err;
  }
}
