import * as repositorio from "../repositorios/aprendices.repositorio.js";
import { Programa } from "../modelos/programa.modelo.js";
import { AppError } from "../errors/AppError.js";
import type { CrearAprendizInput, ActualizarAprendizInput } from "../schemas/aprendiz.schema.js";
import type { ResultadoPaginado } from "../repositorios/aprendices.repositorio.js";

async function verificarProgramaExiste(programaId: string): Promise<void> {
  const existe = await Programa.exists({ _id: programaId });
  if (!existe) throw new AppError(400, "El programa indicado no existe");
}

export async function listarPaginado(page: number, limit: number, search?: string): Promise<ResultadoPaginado<unknown>> {
  return repositorio.obtenerTodos(page, limit, search);
}

export async function obtenerPorId(id: string): Promise<unknown> {
  return repositorio.obtenerPorId(id);
}

export async function crear(datos: CrearAprendizInput, creadoPor: string): Promise<unknown> {
  await verificarProgramaExiste(datos.programa);
  return repositorio.crear(datos, creadoPor);
}

export async function actualizar(
  id: string,
  datos: ActualizarAprendizInput,
  solicitanteId: string,
  solicitanteRol: string
): Promise<unknown> {
  const existente = (await repositorio.obtenerPorId(id)) as { createdBy: string };

  if (solicitanteRol !== "admin" && existente.createdBy !== solicitanteId) {
    throw new AppError(403, "Solo puedes editar los aprendices que tú registraste");
  }

  if (datos.programa) {
    await verificarProgramaExiste(datos.programa);
  }
  return repositorio.actualizar(id, datos);
}

export async function eliminar(id: string): Promise<void> {
  return repositorio.eliminar(id);
}
