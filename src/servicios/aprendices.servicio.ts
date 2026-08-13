import * as repositorio from "../repositorios/aprendices.repositorio.js";
import { AppError } from "../errors/AppError.js";
import type { Apprentice, RespuestaPaginada } from "../tipos.js";
import type { CrearAprendizInput, ActualizarAprendizInput } from "../schemas/aprendiz.schema.js";

export async function listarPaginado(page: number, limit: number): Promise<RespuestaPaginada<Apprentice>> {
  const todos = await repositorio.obtenerTodos();
  const total = todos.length;
  const start = (page - 1) * limit;
  const data = todos.slice(start, start + limit);
  return { data, total, page, limit };
}

export async function obtenerPorId(id: number): Promise<Apprentice> {
  const aprendiz = await repositorio.obtenerPorId(id);
  if (!aprendiz) {
    throw new AppError(404, `Aprendiz con id ${id} no encontrado`);
  }
  return aprendiz;
}

export async function crear(datos: CrearAprendizInput): Promise<Apprentice> {
  return repositorio.crear(datos);
}

export async function actualizar(id: number, datos: ActualizarAprendizInput): Promise<Apprentice> {
  const aprendiz = await repositorio.actualizar(id, datos);
  if (!aprendiz) {
    throw new AppError(404, `Aprendiz con id ${id} no encontrado`);
  }
  return aprendiz;
}

export async function eliminar(id: number): Promise<void> {
  const eliminado = await repositorio.eliminar(id);
  if (!eliminado) {
    throw new AppError(404, `Aprendiz con id ${id} no encontrado`);
  }
}
