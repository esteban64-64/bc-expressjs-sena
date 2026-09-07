import type { Request, Response, NextFunction } from "express";
import * as servicio from "../servicios/programas.servicio.js";
import { crearProgramaSchema, actualizarProgramaSchema, objectIdSchema } from "../schemas/programa.schema.js";

export async function listar(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const programas = await servicio.listarTodos();
    res.status(200).json({ data: programas });
  } catch (err) {
    next(err);
  }
}

export async function obtenerPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedParams = objectIdSchema.safeParse(req.params);
    if (!parsedParams.success) {
      next(parsedParams.error);
      return;
    }
    const programa = await servicio.obtenerPorId(parsedParams.data.id);
    res.status(200).json({ data: programa });
  } catch (err) {
    next(err);
  }
}

export async function crear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = crearProgramaSchema.safeParse(req.body);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    const programa = await servicio.crear(parsed.data);
    res.status(201).json({ data: programa });
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedParams = objectIdSchema.safeParse(req.params);
    if (!parsedParams.success) {
      next(parsedParams.error);
      return;
    }
    const parsedBody = actualizarProgramaSchema.safeParse(req.body);
    if (!parsedBody.success) {
      next(parsedBody.error);
      return;
    }
    const programa = await servicio.actualizar(parsedParams.data.id, parsedBody.data);
    res.status(200).json({ data: programa });
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedParams = objectIdSchema.safeParse(req.params);
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
