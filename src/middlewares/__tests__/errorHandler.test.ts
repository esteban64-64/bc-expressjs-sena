// ============================================================
// UNIT TESTS — errorHandler middleware
// ============================================================

import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "../errorHandler.js";
import { AppError } from "../../errors/AppError.js";

function mockRes() {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("errorHandler — Unit Tests", () => {
  it("debe responder 500 genérico para un Error no manejado, sin exponer el mensaje en producción", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const res = mockRes();

    errorHandler(new Error("detalle interno sensible"), {} as Request, res, jest.fn() as NextFunction);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Error interno del servidor" })
    );

    process.env.NODE_ENV = original;
  });

  it("debe incluir el mensaje real del error en desarrollo", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const res = mockRes();

    errorHandler(new Error("detalle interno"), {} as Request, res, jest.fn() as NextFunction);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "detalle interno" }));

    process.env.NODE_ENV = original;
  });

  it("debe responder con el statusCode del AppError operacional", () => {
    const res = mockRes();
    errorHandler(new AppError(404, "No encontrado"), {} as Request, res, jest.fn() as NextFunction);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Not Found", message: "No encontrado" }));
  });

  it("debe responder con el statusCode del AppError no operacional (isOperational: false)", () => {
    const res = mockRes();
    errorHandler(new AppError(500, "Error crítico", false), {} as Request, res, jest.fn() as NextFunction);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
