import type { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

/**
 * requireRole — factory de middleware que verifica req.user.role contra
 * la lista de roles permitidos. SIEMPRE debe ejecutarse DESPUÉS de
 * authMiddleware (requiere req.user ya poblado).
 */
export function requireRole(...roles: string[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, "Autenticación requerida"));
      return;
    }

    if (!roles.includes(req.user.role as string)) {
      next(new AppError(403, `Acceso denegado. Roles requeridos: ${roles.join(", ")}`));
      return;
    }

    next();
  };
}
