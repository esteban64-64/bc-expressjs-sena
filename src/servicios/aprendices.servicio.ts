import * as repositorio from "../repositorios/aprendices.repositorio.js";
import type {
  Apprentice,
  CrearAprendizDto,
  ActualizarAprendizDto,
  RespuestaPaginada,
  OpcionesPaginacion,
} from "../tipos.js";

/**
 * Service — Lógica de negocio, paginación y validaciones de dominio.
 * SIN imports de Express.
 */

export async function listarPaginado(opciones: OpcionesPaginacion): Promise<RespuestaPaginada<Apprentice>> {
  const { page, limit } = opciones;
  const todos = await repositorio.obtenerTodos();
  const total = todos.length;

  const start = (page - 1) * limit;
  const end = start + limit;
  const data = todos.slice(start, end);

  return { data, total, page, limit };
}

export async function obtenerPorId(id: number): Promise<Apprentice | undefined> {
  return repositorio.obtenerPorId(id);
}

export async function crear(datos: CrearAprendizDto): Promise<Apprentice> {
  // Validación de dominio
  if (!datos.nombre_completo || !datos.documento || !datos.ficha) {
    throw new Error("Faltan campos obligatorios: nombre_completo, documento, ficha");
  }
  if (!["activo", "retirado", "graduado"].includes(datos.estado)) {
    throw new Error("Estado inválido. Debe ser: activo, retirado, graduado");
  }
  return repositorio.crear(datos);
}

export async function actualizar(id: number, datos: ActualizarAprendizDto): Promise<Apprentice | undefined> {
  if (datos.estado && !["activo", "retirado", "graduado"].includes(datos.estado)) {
    throw new Error("Estado inválido. Debe ser: activo, retirado, graduado");
  }
  return repositorio.actualizar(id, datos);
}

export async function eliminar(id: number): Promise<boolean> {
  return repositorio.eliminar(id);
}
