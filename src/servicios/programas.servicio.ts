import * as repositorio from "../repositorios/programas.repositorio.js";
import type { CrearProgramaInput, ActualizarProgramaInput } from "../schemas/programa.schema.js";

export async function listarTodos(): Promise<unknown[]> {
  return repositorio.obtenerTodos();
}

export async function obtenerPorId(id: string): Promise<unknown> {
  return repositorio.obtenerPorId(id);
}

export async function crear(datos: CrearProgramaInput): Promise<unknown> {
  return repositorio.crear(datos);
}

export async function actualizar(id: string, datos: ActualizarProgramaInput): Promise<unknown> {
  return repositorio.actualizar(id, datos);
}

export async function eliminar(id: string): Promise<void> {
  return repositorio.eliminar(id);
}
