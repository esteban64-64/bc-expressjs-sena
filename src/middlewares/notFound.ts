import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

/**
 * Middleware 404 — se registra ANTES del errorHandler.
 * Lanza AppError(404) para que el errorHandler lo maneje.
 */

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta ${req.originalUrl} no encontrada`));
}
