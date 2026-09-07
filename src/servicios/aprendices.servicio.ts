import type { Apprentice } from "@prisma/client";
import * as repositorio from "../repositorios/aprendices.repositorio.js";
import { AppError } from "../errors/AppError.js";
import type { RespuestaPaginada } from "../tipos.js";
import type { CrearAprendizInput, ActualizarAprendizInput } from "../schemas/aprendiz.schema.js";

export async function listarPaginado(page: number, limit: number): Promise<RespuestaPaginada<unknown>> {
  const { data, total } = await repositorio.obtenerTodos(page, limit);
  return { data, total, page, limit };
}

export async function obtenerPorId(id: string): Promise<unknown> {
  const aprendiz = await repositorio.obtenerPorId(id);
  if (!aprendiz) throw new AppError(404, "Aprendiz no encontrado");
  return aprendiz;
}

export async function crear(datos: CrearAprendizInput): Promise<Apprentice> {
  return repositorio.crear(datos);
}

export async function actualizar(id: string, datos: ActualizarAprendizInput): Promise<Apprentice> {
  return repositorio.actualizar(id, datos);
}

export async function eliminar(id: string): Promise<void> {
  return repositorio.eliminar(id);
}
