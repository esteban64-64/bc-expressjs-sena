// ============================================================
// INTEGRATION TESTS — rutas de aprendices (+ smoke test de programs)
// ============================================================
// Ciclo completo con Supertest + MongoDB Memory Server.
// ============================================================

import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../aplicacion.js";
import { connectDB, disconnectDB } from "../config/mongoose.js";
import { UserModel } from "../modelos/user.model.js";
import { Aprendiz } from "../modelos/aprendiz.modelo.js";

let mongod: MongoMemoryServer;

let cookieInstructor: string;
let cookieAdmin: string;
let cookieOtroUser: string;
let programaId: string;

function extraerCookieAccessToken(setCookieHeader: string[] | undefined): string {
  const linea = (setCookieHeader ?? []).find((c) => c.startsWith("accessToken="));
  if (!linea) throw new Error("No se recibió cookie accessToken en la respuesta de login");
  return linea.split(";")[0]!;
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await connectDB();
  // Espera a que Mongoose termine de crear los índices únicos
  // (documento/nombre) antes de correr los tests de duplicado.
  await Promise.all([Aprendiz.init(), UserModel.init()]);

  // Usuario "instructor" (rol user por defecto) vía la API pública
  await request(app)
    .post("/api/v1/auth/register")
    .send({ email: "instructor@test.com", password: "Password1", name: "Instructor Test" });
  const loginInstructor = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "instructor@test.com", password: "Password1" });
  cookieInstructor = extraerCookieAccessToken(loginInstructor.headers["set-cookie"] as unknown as string[]);

  // Segundo usuario normal, sin relación con los aprendices del instructor
  await request(app)
    .post("/api/v1/auth/register")
    .send({ email: "otro@test.com", password: "Password1", name: "Otro Usuario" });
  const loginOtro = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "otro@test.com", password: "Password1" });
  cookieOtroUser = extraerCookieAccessToken(loginOtro.headers["set-cookie"] as unknown as string[]);

  // No existe endpoint público para crear un admin (por diseño) — se crea
  // directamente en la base de datos, como haría un seed/migración.
  const passwordHash = await import("bcrypt").then((b) => b.default.hash("Password1", 10));
  await UserModel.create({ email: "admin@test.com", password: passwordHash, name: "Admin Test", role: "admin" });
  const loginAdmin = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "admin@test.com", password: "Password1" });
  cookieAdmin = extraerCookieAccessToken(loginAdmin.headers["set-cookie"] as unknown as string[]);

  // Programa base para poder crear aprendices
  const crearPrograma = await request(app)
    .post("/api/v1/programs")
    .send({ nombre: "Análisis y Desarrollo de Software", nivel: "Tecnólogo", duracionMeses: 24 });
  programaId = crearPrograma.body.data._id;
});

afterEach(async () => {
  // Solo se limpia la colección bajo prueba — usuarios/programas de fixture
  // (creados en beforeAll) se mantienen para no invalidar las cookies.
  await Aprendiz.deleteMany({});
});

afterAll(async () => {
  await disconnectDB();
  await mongod.stop();
});

function datosAprendizValidos(overrides: Record<string, unknown> = {}) {
  return {
    nombreCompleto: "Valentina Ruiz",
    documento: "1010234567",
    programa: programaId,
    ficha: "2765412",
    estado: "activo",
    fechaIngreso: "2025-01-15",
    promedioAcumulado: 4.5,
    costoMatricula: 1200000,
    ...overrides,
  };
}

describe("GET /api/v1/apprentices", () => {
  it("debe retornar 401 sin cookie de autenticación", async () => {
    const res = await request(app).get("/api/v1/apprentices");
    expect(res.status).toBe(401);
  });

  it("debe retornar 200 con arreglo vacío inicialmente", async () => {
    const res = await request(app).get("/api/v1/apprentices").set("Cookie", cookieInstructor);
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });
});

describe("POST /api/v1/apprentices", () => {
  it("debe retornar 201 con datos válidos y cookie", async () => {
    const res = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    expect(res.status).toBe(201);
    expect(res.body.data.nombreCompleto).toBe("Valentina Ruiz");
  });

  it("debe retornar 401 sin cookie", async () => {
    const res = await request(app).post("/api/v1/apprentices").send(datosAprendizValidos());
    expect(res.status).toBe(401);
  });

  it("debe retornar 400 con datos inválidos (Zod)", async () => {
    const res = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send({ nombreCompleto: "" });

    expect(res.status).toBe(400);
    expect(res.body.issues).toBeDefined();
  });

  it("debe retornar 409 con un documento duplicado", async () => {
    await request(app).post("/api/v1/apprentices").set("Cookie", cookieInstructor).send(datosAprendizValidos());

    const res = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    expect(res.status).toBe(409);
  });

  it("debe retornar 400 cuando el programa referenciado no existe", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos({ programa: idInexistente }));

    expect(res.status).toBe(400);
  });
});

describe("GET /api/v1/apprentices/:id", () => {
  it("debe retornar 200 con un aprendiz existente", async () => {
    const creado = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    const res = await request(app)
      .get(`/api/v1/apprentices/${creado.body.data._id}`)
      .set("Cookie", cookieInstructor);

    expect(res.status).toBe(200);
    expect(res.body.data.documento).toBe("1010234567");
  });

  it("debe retornar 404 con un ID inexistente", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .get(`/api/v1/apprentices/${idInexistente}`)
      .set("Cookie", cookieInstructor);

    expect(res.status).toBe(404);
  });

  it("debe retornar 400 con un ID de formato inválido", async () => {
    const res = await request(app)
      .get("/api/v1/apprentices/id-no-valido")
      .set("Cookie", cookieInstructor);

    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/v1/apprentices/:id", () => {
  it("debe retornar 200 cuando el dueño (quien lo registró) actualiza", async () => {
    const creado = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    const res = await request(app)
      .patch(`/api/v1/apprentices/${creado.body.data._id}`)
      .set("Cookie", cookieInstructor)
      .send({ estado: "graduado" });

    expect(res.status).toBe(200);
    expect(res.body.data.estado).toBe("graduado");
  });

  it("debe retornar 403 cuando un usuario que no es dueño ni admin intenta actualizar", async () => {
    const creado = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    const res = await request(app)
      .patch(`/api/v1/apprentices/${creado.body.data._id}`)
      .set("Cookie", cookieOtroUser)
      .send({ estado: "graduado" });

    expect(res.status).toBe(403);
  });

  it("debe retornar 404 al actualizar un ID inexistente", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .patch(`/api/v1/apprentices/${idInexistente}`)
      .set("Cookie", cookieInstructor)
      .send({ estado: "graduado" });

    expect(res.status).toBe(404);
  });

  it("debe retornar 400 con un body inválido (Zod)", async () => {
    const creado = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    const res = await request(app)
      .patch(`/api/v1/apprentices/${creado.body.data._id}`)
      .set("Cookie", cookieInstructor)
      .send({ estado: "estado-invalido" });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/v1/apprentices/:id", () => {
  it("debe retornar 204 cuando admin elimina", async () => {
    const creado = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    const res = await request(app)
      .delete(`/api/v1/apprentices/${creado.body.data._id}`)
      .set("Cookie", cookieAdmin);

    expect(res.status).toBe(204);
  });

  it("debe retornar 403 cuando un usuario no-admin intenta eliminar", async () => {
    const creado = await request(app)
      .post("/api/v1/apprentices")
      .set("Cookie", cookieInstructor)
      .send(datosAprendizValidos());

    const res = await request(app)
      .delete(`/api/v1/apprentices/${creado.body.data._id}`)
      .set("Cookie", cookieInstructor);

    expect(res.status).toBe(403);
  });

  it("debe retornar 404 al eliminar un ID inexistente (admin)", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/v1/apprentices/${idInexistente}`)
      .set("Cookie", cookieAdmin);

    expect(res.status).toBe(404);
  });
});

// Smoke test de la entidad secundaria (Programa) — fuera del alcance
// principal de la semana, pero cubre el CRUD público de /api/v1/programs.
describe("Programs (entidad secundaria) — smoke test", () => {
  it("GET /api/v1/programs debe retornar 200 con al menos el programa de fixture", async () => {
    const res = await request(app).get("/api/v1/programs");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/v1/programs/:id debe retornar 200", async () => {
    const res = await request(app).get(`/api/v1/programs/${programaId}`);
    expect(res.status).toBe(200);
  });

  it("PUT /api/v1/programs/:id debe retornar 200", async () => {
    const res = await request(app).put(`/api/v1/programs/${programaId}`).send({ duracionMeses: 26 });
    expect(res.status).toBe(200);
    expect(res.body.data.duracionMeses).toBe(26);
  });

  it("DELETE con un ID inexistente debe retornar 404", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/v1/programs/${idInexistente}`);
    expect(res.status).toBe(404);
  });
});
