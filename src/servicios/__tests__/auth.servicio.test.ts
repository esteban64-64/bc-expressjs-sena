// ============================================================
// UNIT TESTS — auth.servicio.ts
// ============================================================
// Mockea el repositorio de usuarios, bcrypt y los utils de JWT —
// testea register/login/refresh/logout/getMe en aislamiento.
// ============================================================

jest.mock("../../repositorios/usuarios.repositorio.js");
jest.mock("../../utils/jwt.js");
jest.mock("bcrypt");

import bcrypt from "bcrypt";
import * as usuariosRepositorio from "../../repositorios/usuarios.repositorio.js";
import * as jwtUtils from "../../utils/jwt.js";
import * as authServicio from "../auth.servicio.js";
import { AppError } from "../../errors/AppError.js";
import type { IUser } from "../../modelos/user.model.js";

const mockFindByEmail = usuariosRepositorio.findByEmail as jest.MockedFunction<typeof usuariosRepositorio.findByEmail>;
const mockFindByEmailWithPassword = usuariosRepositorio.findByEmailWithPassword as jest.MockedFunction<
  typeof usuariosRepositorio.findByEmailWithPassword
>;
const mockFindByIdWithTokens = usuariosRepositorio.findByIdWithTokens as jest.MockedFunction<
  typeof usuariosRepositorio.findByIdWithTokens
>;
const mockFindById = usuariosRepositorio.findById as jest.MockedFunction<typeof usuariosRepositorio.findById>;
const mockCreate = usuariosRepositorio.create as jest.MockedFunction<typeof usuariosRepositorio.create>;
const mockUpdateRefreshToken = usuariosRepositorio.updateRefreshToken as jest.MockedFunction<
  typeof usuariosRepositorio.updateRefreshToken
>;

const mockHash = bcrypt.hash as unknown as jest.Mock;
const mockCompare = bcrypt.compare as unknown as jest.Mock;
const mockSignAccessToken = jwtUtils.signAccessToken as jest.MockedFunction<typeof jwtUtils.signAccessToken>;
const mockSignRefreshToken = jwtUtils.signRefreshToken as jest.MockedFunction<typeof jwtUtils.signRefreshToken>;
const mockVerifyRefreshToken = jwtUtils.verifyRefreshToken as jest.MockedFunction<typeof jwtUtils.verifyRefreshToken>;

const usuarioBase = {
  _id: { toString: () => "user-id-123" },
  email: "instructor@sena.edu.co",
  password: "hash-guardado",
  name: "Instructor SENA",
  role: "user",
  refreshToken: "hash-refresh-guardado",
} as unknown as IUser;

describe("AuthServicio — Unit Tests", () => {
  describe("register()", () => {
    it("debe crear el usuario con la contraseña hasheada cuando el email no existe", async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockHash.mockResolvedValue("password-hasheado");
      mockCreate.mockResolvedValue(usuarioBase);

      const resultado = await authServicio.register({
        email: "instructor@sena.edu.co",
        password: "Clave123",
        name: "Instructor SENA",
      });

      expect(resultado).toEqual(usuarioBase);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ password: "password-hasheado" })
      );
    });

    it("debe lanzar AppError 409 cuando el email ya está registrado", async () => {
      mockFindByEmail.mockResolvedValue(usuarioBase);

      await expect(
        authServicio.register({ email: "instructor@sena.edu.co", password: "Clave123", name: "X" })
      ).rejects.toMatchObject({ statusCode: 409 });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("login()", () => {
    it("debe retornar tokens con credenciales válidas", async () => {
      mockFindByEmailWithPassword.mockResolvedValue(usuarioBase);
      mockCompare.mockResolvedValue(true);
      mockSignAccessToken.mockReturnValue("access-token");
      mockSignRefreshToken.mockReturnValue("refresh-token");
      mockHash.mockResolvedValue("refresh-hasheado");

      const tokens = await authServicio.login({ email: "instructor@sena.edu.co", password: "Clave123" });

      expect(tokens.accessToken).toBe("access-token");
      expect(tokens.refreshToken).toBe("refresh-token");
      expect(mockUpdateRefreshToken).toHaveBeenCalledWith("user-id-123", "refresh-hasheado");
    });

    it("debe lanzar AppError 401 cuando el email no existe", async () => {
      mockFindByEmailWithPassword.mockResolvedValue(null);

      await expect(
        authServicio.login({ email: "no-existe@sena.edu.co", password: "Clave123" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("debe lanzar AppError 401 cuando la contraseña es incorrecta", async () => {
      mockFindByEmailWithPassword.mockResolvedValue(usuarioBase);
      mockCompare.mockResolvedValue(false);

      await expect(
        authServicio.login({ email: "instructor@sena.edu.co", password: "Incorrecta" })
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe("refresh()", () => {
    it("debe rotar los tokens con un refresh token válido", async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: "user-id-123" });
      mockFindByIdWithTokens.mockResolvedValue(usuarioBase);
      mockCompare.mockResolvedValue(true);
      mockSignAccessToken.mockReturnValue("nuevo-access");
      mockSignRefreshToken.mockReturnValue("nuevo-refresh");
      mockHash.mockResolvedValue("nuevo-hash");

      const tokens = await authServicio.refresh("refresh-token-valido");

      expect(tokens.accessToken).toBe("nuevo-access");
      expect(mockUpdateRefreshToken).toHaveBeenCalledWith("user-id-123", "nuevo-hash");
    });

    it("debe lanzar AppError 401 cuando el token es inválido o expiró", async () => {
      mockVerifyRefreshToken.mockImplementation(() => {
        throw new Error("jwt expired");
      });

      await expect(authServicio.refresh("token-invalido")).rejects.toMatchObject({ statusCode: 401 });
    });

    it("debe lanzar AppError 401 cuando el usuario no tiene sesión activa", async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: "user-id-123" });
      mockFindByIdWithTokens.mockResolvedValue({ ...usuarioBase, refreshToken: undefined } as unknown as IUser);

      await expect(authServicio.refresh("refresh-token")).rejects.toMatchObject({ statusCode: 401 });
    });

    it("debe lanzar AppError 401 cuando el token no coincide con el hash almacenado", async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: "user-id-123" });
      mockFindByIdWithTokens.mockResolvedValue(usuarioBase);
      mockCompare.mockResolvedValue(false);

      await expect(authServicio.refresh("refresh-token-robado")).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe("logout()", () => {
    it("debe invalidar el refresh token del usuario", async () => {
      await authServicio.logout("user-id-123");

      expect(mockUpdateRefreshToken).toHaveBeenCalledWith("user-id-123", undefined);
    });
  });

  describe("getMe()", () => {
    it("debe retornar el usuario cuando existe", async () => {
      mockFindById.mockResolvedValue(usuarioBase);

      const resultado = await authServicio.getMe("user-id-123");

      expect(resultado).toEqual(usuarioBase);
    });

    it("debe lanzar AppError 404 cuando el usuario no existe", async () => {
      mockFindById.mockResolvedValue(null);

      await expect(authServicio.getMe("no-existe")).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
