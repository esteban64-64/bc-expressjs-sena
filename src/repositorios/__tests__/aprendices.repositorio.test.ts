// ============================================================
// UNIT/INTEGRATION TESTS — repositorios (llamados directamente)
// ============================================================
// Los schemas Zod ya bloquean un ID mal formado antes de llegar al
// repositorio (ver aprendices.routes.test.ts), así que el catch de
// CastError del repositorio es defensa en profundidad inalcanzable
// vía HTTP. Se prueba llamando el repositorio directamente contra un
// Mongo real (MongoMemoryServer), como haría otro servicio interno
// que no pase por la capa HTTP.
// ============================================================

import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "../../config/mongoose.js";
import * as aprendicesRepo from "../aprendices.repositorio.js";
import * as programasRepo from "../programas.repositorio.js";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
  await mongod.stop();
});

describe("aprendices.repositorio — defensa en profundidad (CastError)", () => {
  it("obtenerPorId debe lanzar AppError 400 con un ID no-ObjectId", async () => {
    await expect(aprendicesRepo.obtenerPorId("no-es-un-object-id")).rejects.toMatchObject({ statusCode: 400 });
  });

  it("actualizar debe lanzar AppError 400 con un ID no-ObjectId", async () => {
    await expect(aprendicesRepo.actualizar("no-es-un-object-id", { estado: "activo" })).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("eliminar debe lanzar AppError 400 con un ID no-ObjectId", async () => {
    await expect(aprendicesRepo.eliminar("no-es-un-object-id")).rejects.toMatchObject({ statusCode: 400 });
  });

  it("crear debe lanzar AppError 400 cuando programa no es un ObjectId válido", async () => {
    await expect(
      aprendicesRepo.crear(
        {
          nombreCompleto: "X",
          documento: "999999",
          programa: "no-es-un-object-id",
          ficha: "1",
          estado: "activo",
          fechaIngreso: new Date(),
          promedioAcumulado: 4,
          costoMatricula: 100,
        },
        "user-id"
      )
    ).rejects.toMatchObject({ statusCode: 400 });
  });
});

describe("programas.repositorio — defensa en profundidad (CastError)", () => {
  it("obtenerPorId debe lanzar AppError 400 con un ID no-ObjectId", async () => {
    await expect(programasRepo.obtenerPorId("no-es-un-object-id")).rejects.toMatchObject({ statusCode: 400 });
  });

  it("actualizar debe lanzar AppError 400 con un ID no-ObjectId", async () => {
    await expect(programasRepo.actualizar("no-es-un-object-id", { duracionMeses: 10 })).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("eliminar debe lanzar AppError 400 con un ID no-ObjectId", async () => {
    await expect(programasRepo.eliminar("no-es-un-object-id")).rejects.toMatchObject({ statusCode: 400 });
  });
});
