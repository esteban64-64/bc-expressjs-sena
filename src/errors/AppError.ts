/**
 * AppError — Clase para errores HTTP operacionales del dominio.
 * isOperational = true → errores esperados (404, 400, etc.)
 * isOperational = false → errores inesperados (500)
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
