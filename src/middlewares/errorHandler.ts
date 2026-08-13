import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";
import { logger } from "../config/logger.js";

/**
 * Middleware global de errores — EXACTAMENTE 4 parámetros.
 * Distingue:
 *   - ZodError → 400 con issues[]
 *   - AppError → statusCode del error
 *   - Genérico → 500
 */

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ZodError → 400 Bad Request
  if (err instanceof ZodError) {
    logger.warn(`[ZodError] ${err.errors.length} issues de validación`);
    res.status(400).json({
      error: "Bad Request",
      message: "Datos de entrada inválidos",
      issues: err.errors,
    });
    return;
  }

  // AppError → usar su statusCode
  if (err instanceof AppError) {
    if (err.isOperational) {
      logger.warn(`[AppError ${err.statusCode}] ${err.message}`);
    } else {
      logger.error(`[AppError no operacional] ${err.message}`);
    }
    res.status(err.statusCode).json({
      error: getErrorName(err.statusCode),
      message: err.message,
    });
    return;
  }

  // Error genérico → 500
  logger.error(`[Error no manejado] ${err.message}`);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Error interno del servidor",
  });
}

function getErrorName(statusCode: number): string {
  const map: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
  };
  return map[statusCode] || "Error";
}
