// ============================================================
// UNIT TESTS — aprendices.servicio.ts
// ============================================================
// Mockea el repositorio y el modelo Programa — testea la lógica de
// negocio pura (sin tocar Mongo).
// ============================================================

jest.mock("../../repositorios/aprendices.repositorio.js");
jest.mock("../../modelos/programa.modelo.js", () => ({
  Programa: { exists: jest.fn() },
}));

import * as repositorio from "../../repositorios/aprendices.repositorio.js";
import { Programa } from "../../modelos/programa.modelo.js";
import * as servicio from "../aprendices.servicio.js";
import { AppError } from "../../errors/AppError.js";
import type { CrearAprendizInput } from "../../schemas/aprendiz.schema.js";

const mockObtenerTodos = repositorio.obtenerTodos as jest.MockedFunction<typeof repositorio.obtenerTodos>;
const mockObtenerPorId = repositorio.obtenerPorId as jest.MockedFunction<typeof repositorio.obtenerPorId>;
const mockCrear = repositorio.crear as jest.MockedFunction<typeof repositorio.crear>;
const mockActualizar = repositorio.actualizar as jest.MockedFunction<typeof repositorio.actualizar>;
const mockEliminar = repositorio.eliminar as jest.MockedFunction<typeof repositorio.eliminar>;
const mockProgramaExists = Programa.exists as jest.Mock;

const PROGRAMA_ID = "507f1f77bcf86cd799439011";
const APRENDIZ_ID = "507f1f77bcf86cd799439012";
const INSTRUCTOR_ID = "507f191e810c19729de860ea";
const OTRO_USER_ID = "507f191e810c19729de860eb";

const datosCreacion: CrearAprendizInput = {
  nombreCompleto: "Aprendiz de Prueba",
  documento: "1234567890",
  programa: PROGRAMA_ID,
  ficha: "2765412",
  estado: "activo",
  fechaIngreso: new Date("2025-01-15"),
  promedioAcumulado: 4.5,
  costoMatricula: 1200000,
};

const aprendizExistente = {
  _id: APRENDIZ_ID,
  ...datosCreacion,
  createdBy: INSTRUCTOR_ID,
};

describe("AprendicesServicio — Unit Tests", () => {
  describe("listarPaginado()", () => {
    it("debe retornar la lista paginada delegando al repositorio", async () => {
      const resultado = { data: [aprendizExistente], total: 1, page: 1, totalPages: 1 };
      mockObtenerTodos.mockResolvedValue(resultado);

      const respuesta = await servicio.listarPaginado(1, 10);

      expect(respuesta).toEqual(resultado);
      expect(mockObtenerTodos).toHaveBeenCalledWith(1, 10, undefined);
    });

    it("debe retornar arreglo vacío cuando no hay aprendices", async () => {
      mockObtenerTodos.mockResolvedValue({ data: [], total: 0, page: 1, totalPages: 0 });

      const respuesta = await servicio.listarPaginado(1, 10);

      expect(respuesta.data).toEqual([]);
      expect(respuesta.total).toBe(0);
    });
  });

  describe("obtenerPorId()", () => {
    it("debe retornar el aprendiz cuando existe", async () => {
      mockObtenerPorId.mockResolvedValue(aprendizExistente);

      const resultado = await servicio.obtenerPorId(APRENDIZ_ID);

      expect(resultado).toEqual(aprendizExistente);
    });

    it("debe propagar AppError 404 cuando el repositorio lo lanza", async () => {
      mockObtenerPorId.mockRejectedValue(new AppError(404, "Aprendiz no encontrado"));

      await expect(servicio.obtenerPorId("no-existe")).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe("crear()", () => {
    it("debe crear el aprendiz cuando el programa existe", async () => {
      mockProgramaExists.mockResolvedValue({ _id: PROGRAMA_ID });
      mockCrear.mockResolvedValue(aprendizExistente);

      const resultado = await servicio.crear(datosCreacion, INSTRUCTOR_ID);

      expect(resultado).toEqual(aprendizExistente);
      expect(mockCrear).toHaveBeenCalledWith(datosCreacion, INSTRUCTOR_ID);
    });

    it("debe lanzar AppError 400 cuando el programa no existe", async () => {
      mockProgramaExists.mockResolvedValue(null);

      await expect(servicio.crear(datosCreacion, INSTRUCTOR_ID)).rejects.toMatchObject({ statusCode: 400 });
      expect(mockCrear).not.toHaveBeenCalled();
    });
  });

  describe("actualizar()", () => {
    it("debe actualizar cuando el solicitante es quien registró al aprendiz", async () => {
      mockObtenerPorId.mockResolvedValue(aprendizExistente);
      mockActualizar.mockResolvedValue({ ...aprendizExistente, estado: "graduado" });

      const resultado = await servicio.actualizar(APRENDIZ_ID, { estado: "graduado" }, INSTRUCTOR_ID, "user");

      expect((resultado as { estado: string }).estado).toBe("graduado");
    });

    it("debe actualizar cuando el solicitante es admin (aunque no sea el creador)", async () => {
      mockObtenerPorId.mockResolvedValue(aprendizExistente);
      mockActualizar.mockResolvedValue({ ...aprendizExistente, estado: "retirado" });

      const resultado = await servicio.actualizar(APRENDIZ_ID, { estado: "retirado" }, OTRO_USER_ID, "admin");

      expect((resultado as { estado: string }).estado).toBe("retirado");
    });

    it("debe lanzar AppError 403 cuando el solicitante no es el creador ni admin", async () => {
      mockObtenerPorId.mockResolvedValue(aprendizExistente);

      await expect(
        servicio.actualizar(APRENDIZ_ID, { estado: "retirado" }, OTRO_USER_ID, "user")
      ).rejects.toMatchObject({ statusCode: 403 });
      expect(mockActualizar).not.toHaveBeenCalled();
    });

    it("debe propagar AppError 404 cuando el aprendiz no existe", async () => {
      mockObtenerPorId.mockRejectedValue(new AppError(404, "Aprendiz no encontrado"));

      await expect(
        servicio.actualizar("no-existe", { estado: "retirado" }, INSTRUCTOR_ID, "user")
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it("debe validar que el nuevo programa exista cuando se incluye en la actualización", async () => {
      mockObtenerPorId.mockResolvedValue(aprendizExistente);
      mockProgramaExists.mockResolvedValue(null);

      await expect(
        servicio.actualizar(APRENDIZ_ID, { programa: "otro-id" }, INSTRUCTOR_ID, "user")
      ).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe("eliminar()", () => {
    it("debe eliminar delegando al repositorio", async () => {
      mockEliminar.mockResolvedValue(undefined);

      await servicio.eliminar(APRENDIZ_ID);

      expect(mockEliminar).toHaveBeenCalledWith(APRENDIZ_ID);
    });

    it("debe propagar AppError 404 cuando el aprendiz no existe", async () => {
      mockEliminar.mockRejectedValue(new AppError(404, "Aprendiz no encontrado"));

      await expect(servicio.eliminar("no-existe")).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
