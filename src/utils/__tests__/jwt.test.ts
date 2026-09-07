// ============================================================
// UNIT TESTS — utils/jwt.ts
// ============================================================
// Sin mocks: prueba las funciones reales de firma/verificación,
// incluyendo la rama de error cuando falta el secret en el entorno.
// ============================================================

import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from "../jwt.js";

describe("jwt utils — Unit Tests", () => {
  it("debe firmar y verificar un access token válido", () => {
    const token = signAccessToken({ sub: "user-1", email: "a@b.com", role: "user" });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("user-1");
    expect(payload.role).toBe("user");
  });

  it("debe firmar y verificar un refresh token válido", () => {
    const token = signRefreshToken({ sub: "user-1" });
    const payload = verifyRefreshToken(token);
    expect(payload.sub).toBe("user-1");
  });

  it("debe lanzar al verificar un access token con firma inválida", () => {
    expect(() => verifyAccessToken("token.invalido.firma")).toThrow();
  });

  it("debe lanzar AppError 500 si JWT_ACCESS_SECRET no está configurado", () => {
    const original = process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_ACCESS_SECRET;

    try {
      signAccessToken({ sub: "user-1" });
      throw new Error("no debió llegar aquí");
    } catch (err) {
      expect((err as { statusCode?: number }).statusCode).toBe(500);
    } finally {
      process.env.JWT_ACCESS_SECRET = original;
    }
  });

  it("debe lanzar AppError 500 si JWT_REFRESH_SECRET no está configurado", () => {
    const original = process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_REFRESH_SECRET;

    try {
      signRefreshToken({ sub: "user-1" });
      throw new Error("no debió llegar aquí");
    } catch (err) {
      expect((err as { statusCode?: number }).statusCode).toBe(500);
    } finally {
      process.env.JWT_REFRESH_SECRET = original;
    }
  });

  it("verifyAccessToken debe lanzar AppError 500 si falta el secret", () => {
    const original = process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_ACCESS_SECRET;

    try {
      verifyAccessToken("cualquier-token");
      throw new Error("no debió llegar aquí");
    } catch (err) {
      expect((err as { statusCode?: number }).statusCode).toBe(500);
    } finally {
      process.env.JWT_ACCESS_SECRET = original;
    }
  });

  it("verifyRefreshToken debe lanzar AppError 500 si falta el secret", () => {
    const original = process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_REFRESH_SECRET;

    try {
      verifyRefreshToken("cualquier-token");
      throw new Error("no debió llegar aquí");
    } catch (err) {
      expect((err as { statusCode?: number }).statusCode).toBe(500);
    } finally {
      process.env.JWT_REFRESH_SECRET = original;
    }
  });
});
