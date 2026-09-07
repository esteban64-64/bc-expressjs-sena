import type { Request, Response, NextFunction } from "express";
import * as servicio from "../servicios/aprendices.servicio.js";
import {
  crearAprendizSchema,
  actualizarAprendizSchema,
  idParamSchema,
  paginacionQuerySchema,
} from "../schemas/aprendiz.schema.js";

export async function listar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = paginacionQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    const resultado = await servicio.listarPaginado(parsed.data.page, parsed.data.limit, parsed.data.search);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      next(parsedParams.error);
      return;
    }
    const aprendiz = await servicio.obtenerPorId(parsedParams.data.id);
    res.status(200).json({ data: aprendiz });
  } catch (err) {
    next(err);
  }
}

export async function crear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = crearAprendizSchema.safeParse(req.body);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    const aprendiz = await servicio.crear(parsed.data);
    res.status(201).json({ data: aprendiz });
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      next(parsedParams.error);
      return;
    }
    const parsedBody = actualizarAprendizSchema.safeParse(req.body);
    if (!parsedBody.success) {
      next(parsedBody.error);
      return;
    }
    const aprendiz = await servicio.actualizar(parsedParams.data.id, parsedBody.data);
    res.status(200).json({ data: aprendiz });
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedParams = idParamSchema.safeParse(req.params);
    if (!parsedParams.success) {
      next(parsedParams.error);
      return;
    }
    await servicio.eliminar(parsedParams.data.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
