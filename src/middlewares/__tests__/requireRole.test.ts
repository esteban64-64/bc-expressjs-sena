// ============================================================
// UNIT TESTS — requireRole middleware
// ============================================================
// Vía HTTP siempre corre después de authMiddleware (req.user ya
// poblado); la rama "sin usuario" solo se puede probar llamando el
// middleware directamente.
// ============================================================

import type { Request, Response, NextFunction } from "express";
import { requireRole } from "../requireRole.js";

function mockReqRes(user?: { role: string }) {
  const req = { user } as unknown as Request;
  const res = {} as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

describe("requireRole — Unit Tests", () => {
  it("debe llamar next() sin argumentos cuando el rol coincide", () => {
    const { req, res, next } = mockReqRes({ role: "admin" });
    requireRole("admin")(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("debe llamar next(AppError 401) cuando no hay req.user", () => {
    const { req, res, next } = mockReqRes(undefined);
    requireRole("admin")(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("debe llamar next(AppError 403) cuando el rol no está permitido", () => {
    const { req, res, next } = mockReqRes({ role: "user" });
    requireRole("admin")(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });
});
