// ============================================================
// INTEGRATION TESTS — rutas de programas (/api/v1/programs)
// ============================================================
// Cubre las ramas de error (400/404/409) que el smoke test principal
// no ejercita: nombre duplicado, body inválido, ID con formato inválido.
// ============================================================

import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../aplicacion.js";
import { connectDB, disconnectDB } from "../config/mongoose.js";
import { Programa } from "../modelos/programa.modelo.js";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await connectDB();
  // Mongoose crea los índices (incluido `unique`) en segundo plano al
  // conectar — sin esperar Programa.init(), el índice único de `nombre`
  // podría no existir todavía cuando corre el primer test de duplicado.
  await Programa.init();
});

afterAll(async () => {
  await disconnectDB();
  await mongod.stop();
});

describe("POST /api/v1/programs", () => {
  it("debe crear un programa con datos válidos (201)", async () => {
    const res = await request(app)
      .post("/api/v1/programs")
      .send({ nombre: "Mecatrónica Industrial", nivel: "Tecnólogo", duracionMeses: 24 });
    expect(res.status).toBe(201);
  });

  it("debe retornar 409 con un nombre duplicado", async () => {
    const res = await request(app)
      .post("/api/v1/programs")
      .send({ nombre: "Mecatrónica Industrial", nivel: "Tecnólogo", duracionMeses: 24 });
    expect(res.status).toBe(409);
  });

  it("debe retornar 400 con un nivel inválido (Zod)", async () => {
    const res = await request(app)
      .post("/api/v1/programs")
      .send({ nombre: "Otro Programa", nivel: "Nivel Invalido", duracionMeses: 12 });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/programs/:id", () => {
  it("debe retornar 400 con un ID con formato inválido", async () => {
    const res = await request(app).get("/api/v1/programs/id-no-valido");
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/v1/programs/:id", () => {
  it("debe retornar 404 al actualizar un ID inexistente", async () => {
    const res = await request(app)
      .put("/api/v1/programs/507f1f77bcf86cd799439099")
      .send({ duracionMeses: 30 });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/v1/programs/:id", () => {
  it("debe eliminar un programa existente (204)", async () => {
    const creado = await request(app)
      .post("/api/v1/programs")
      .send({ nombre: "Programa A Eliminar", nivel: "Auxiliar", duracionMeses: 6 });

    const res = await request(app).delete(`/api/v1/programs/${creado.body.data._id}`);
    expect(res.status).toBe(204);
  });

  it("debe retornar 400 con un ID con formato inválido", async () => {
    const res = await request(app).delete("/api/v1/programs/id-no-valido");
    expect(res.status).toBe(400);
  });
});
