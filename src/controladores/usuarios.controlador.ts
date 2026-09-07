import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export async function obtenerDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, "No autenticado");
    res.status(200).json({
      message: "Bienvenido a tu panel",
      data: { userId: req.user.sub, email: req.user.email, role: req.user.role },
    });
  } catch (err) {
    next(err);
  }
}
