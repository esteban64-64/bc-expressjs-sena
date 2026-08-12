import type { Request, Response } from "express";
import * as servicio from "../servicios/aprendices.servicio.js";
import type { CrearAprendizDto, ActualizarAprendizDto, OpcionesPaginacion } from "../tipos.js";

/**
 * Controller — Exactamente 3 pasos:
 *   1. Extraer datos del request (params, query, body)
 *   2. Llamar al service
 *   3. Responder con el contrato adecuado
 */

export async function listar(req: Request, res: Response): Promise<void> {
  // 1. Extraer
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const opciones: OpcionesPaginacion = { page, limit };

  // 2. Llamar service
  const resultado = await servicio.listarPaginado(opciones);

  // 3. Responder
  res.status(200).json(resultado);
}

export async function obtenerPorId(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "ID inválido" });
    return;
  }

  const aprendiz = await servicio.obtenerPorId(id);
  if (!aprendiz) {
    res.status(404).json({ error: "Not Found", message: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(200).json({ data: aprendiz });
}

export async function crear(req: Request, res: Response): Promise<void> {
  try {
    const datos = req.body as CrearAprendizDto;
    const aprendiz = await servicio.crear(datos);
    res.status(201).json({ data: aprendiz });
  } catch (err) {
    res.status(400).json({ error: "Bad Request", message: err instanceof Error ? err.message : "Error desconocido" });
  }
}

export async function actualizar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "ID inválido" });
    return;
  }

  try {
    const datos = req.body as ActualizarAprendizDto;
    const aprendiz = await servicio.actualizar(id, datos);
    if (!aprendiz) {
      res.status(404).json({ error: "Not Found", message: `Aprendiz con id ${id} no encontrado` });
      return;
    }
    res.status(200).json({ data: aprendiz });
  } catch (err) {
    res.status(400).json({ error: "Bad Request", message: err instanceof Error ? err.message : "Error desconocido" });
  }
}

export async function eliminar(req: Request, res: Response): Promise<void> {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Bad Request", message: "ID inválido" });
    return;
  }

  const eliminado = await servicio.eliminar(id);
  if (!eliminado) {
    res.status(404).json({ error: "Not Found", message: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(204).send();
}
