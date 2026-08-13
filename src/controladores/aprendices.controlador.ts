import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import * as servicio from "../servicios/aprendices.servicio.js";
import { AppError } from "../errors/AppError.js";
import {
  crearAprendizSchema,
  actualizarAprendizSchema,
  idParamSchema,
  paginacionQuerySchema,
} from "../schemas/aprendiz.schema.js";

export async function listar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = paginacionQuerySchema.parse(req.query);
    const resultado = await servicio.listarPaginado(query.page, query.limit);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const aprendiz = await servicio.obtenerPorId(id);
    res.status(200).json({ data: aprendiz });
  } catch (err) {
    next(err);
  }
}

export async function crear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const datos = crearAprendizSchema.parse(req.body);
    const aprendiz = await servicio.crear(datos);
    res.status(201).json({ data: aprendiz });
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    const datos = actualizarAprendizSchema.parse(req.body);
    const aprendiz = await servicio.actualizar(id, datos);
    res.status(200).json({ data: aprendiz });
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = idParamSchema.parse(req.params);
    await servicio.eliminar(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
