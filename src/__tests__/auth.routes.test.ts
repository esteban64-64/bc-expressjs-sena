// ============================================================
// INTEGRATION TESTS — rutas de auth (/api/v1/auth) + /api/v1/users
// ============================================================

import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../aplicacion.js";
import { connectDB, disconnectDB } from "../config/mongoose.js";
import { UserModel } from "../modelos/user.model.js";

let mongod: MongoMemoryServer;

function extraerCookie(setCookieHeader: string[] | undefined, nombre: string): string | undefined {
  return (setCookieHeader ?? []).find((c) => c.startsWith(`${nombre}=`))?.split(";")[0];
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await connectDB();
  // Espera a que Mongoose termine de crear el índice único de `email`
  // antes de correr el test de registro duplicado.
  await UserModel.init();
});

afterAll(async () => {
  await disconnectDB();
  await mongod.stop();
});

describe("POST /api/v1/auth/register", () => {
  it("debe retornar 201 con datos válidos", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "nuevo@test.com", password: "Password1", name: "Nuevo" });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe("user");
  });

  it("debe retornar 409 si el email ya está registrado", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "nuevo@test.com", password: "Password1", name: "Nuevo" });
    expect(res.status).toBe(409);
  });

  it("debe retornar 400 con una contraseña que no cumple la política", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "debil@test.com", password: "abc", name: "Debil" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/v1/auth/login", () => {
  it("debe retornar 401 con email inexistente", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "no-existe@test.com", password: "Password1" });
    expect(res.status).toBe(401);
  });

  it("debe retornar 401 con contraseña incorrecta", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nuevo@test.com", password: "Incorrecta1" });
    expect(res.status).toBe(401);
  });
});

describe("Flujo completo: login -> me -> refresh -> logout -> refresh", () => {
  let cookieAccess: string;
  let cookieRefresh: string;

  it("login debe emitir cookies accessToken y refreshToken", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nuevo@test.com", password: "Password1" });

    expect(res.status).toBe(200);
    const setCookie = res.headers["set-cookie"] as unknown as string[];
    cookieAccess = extraerCookie(setCookie, "accessToken")!;
    cookieRefresh = extraerCookie(setCookie, "refreshToken")!;
    expect(cookieAccess).toBeDefined();
    expect(cookieRefresh).toBeDefined();
  });

  it("GET /me sin cookie debe retornar 401", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });

  it("GET /me con cookie debe retornar 200 con el perfil", async () => {
    const res = await request(app).get("/api/v1/auth/me").set("Cookie", cookieAccess);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("nuevo@test.com");
  });

  it("GET /api/v1/users/dashboard con cookie debe retornar 200", async () => {
    const res = await request(app).get("/api/v1/users/dashboard").set("Cookie", cookieAccess);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("nuevo@test.com");
  });

  it("GET /api/v1/users/dashboard sin cookie debe retornar 401", async () => {
    const res = await request(app).get("/api/v1/users/dashboard");
    expect(res.status).toBe(401);
  });

  it("POST /refresh sin cookie debe retornar 401", async () => {
    const res = await request(app).post("/api/v1/auth/refresh");
    expect(res.status).toBe(401);
  });

  it("POST /refresh con refresh token inválido debe retornar 401", async () => {
    const res = await request(app).post("/api/v1/auth/refresh").set("Cookie", "refreshToken=token-invalido");
    expect(res.status).toBe(401);
  });

  it("POST /refresh con cookie válida debe rotar los tokens (200)", async () => {
    const res = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookieRefresh);
    expect(res.status).toBe(200);

    const setCookie = res.headers["set-cookie"] as unknown as string[];
    cookieAccess = extraerCookie(setCookie, "accessToken")!;
    cookieRefresh = extraerCookie(setCookie, "refreshToken")!;
  });

  it("POST /logout debe cerrar la sesión (200)", async () => {
    const res = await request(app).post("/api/v1/auth/logout").set("Cookie", cookieAccess);
    expect(res.status).toBe(200);
  });

  it("POST /refresh después de logout debe retornar 401 (refresh invalidado)", async () => {
    const res = await request(app).post("/api/v1/auth/refresh").set("Cookie", cookieRefresh);
    expect(res.status).toBe(401);
  });
});

describe("Rutas no encontradas y health check", () => {
  it("GET /health debe retornar 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.estado).toBe("ok");
  });

  it("GET a una ruta inexistente debe retornar 404", async () => {
    const res = await request(app).get("/api/v1/no-existe");
    expect(res.status).toBe(404);
  });
});
