import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError.js";
import * as usuariosRepositorio from "../repositorios/usuarios.repositorio.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { RegisterDto, LoginDto } from "../schemas/auth.schema.js";
import type { IUser } from "../modelos/user.model.js";

const SALT_ROUNDS = 10;
const COOKIE_ACCESS_MAX_AGE = 15 * 60 * 1000; // 15 minutos
const COOKIE_REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días

export interface TokenCookieOptions {
  accessToken: string;
  refreshToken: string;
  accessMaxAge: number;
  refreshMaxAge: number;
}

export async function register(dto: RegisterDto): Promise<IUser> {
  const existente = await usuariosRepositorio.findByEmail(dto.email);
  if (existente) throw new AppError(409, "El email ya está registrado");

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
  return usuariosRepositorio.create({ ...dto, password: hashedPassword });
}

export async function login(dto: LoginDto): Promise<TokenCookieOptions> {
  const user = await usuariosRepositorio.findByEmailWithPassword(dto.email);

  // Mismo mensaje para email no encontrado Y contraseña incorrecta
  // — previene user enumeration attacks
  if (!user) throw new AppError(401, "Credenciales inválidas");

  const coincide = await bcrypt.compare(dto.password, user.password);
  if (!coincide) throw new AppError(401, "Credenciales inválidas");

  const payload = { sub: user._id.toString(), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user._id.toString() });

  // Almacenar HASH del refresh token — nunca el token en claro
  const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await usuariosRepositorio.updateRefreshToken(user._id.toString(), hashedRefresh);

  return {
    accessToken,
    refreshToken,
    accessMaxAge: COOKIE_ACCESS_MAX_AGE,
    refreshMaxAge: COOKIE_REFRESH_MAX_AGE,
  };
}

export async function refresh(incomingToken: string): Promise<TokenCookieOptions> {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(incomingToken) as { sub: string };
  } catch {
    throw new AppError(401, "Refresh token inválido o expirado");
  }

  const user = await usuariosRepositorio.findByIdWithTokens(payload.sub);
  if (!user || !user.refreshToken) {
    throw new AppError(401, "Sesión no válida");
  }

  const esValido = await bcrypt.compare(incomingToken, user.refreshToken);
  if (!esValido) throw new AppError(401, "Refresh token no coincide");

  // Rotación: nuevos tokens, invalidando el hash anterior
  const nuevoPayload = { sub: user._id.toString(), email: user.email, role: user.role };
  const nuevoAccessToken = signAccessToken(nuevoPayload);
  const nuevoRefreshToken = signRefreshToken({ sub: user._id.toString() });

  const nuevoHashedRefresh = await bcrypt.hash(nuevoRefreshToken, SALT_ROUNDS);
  await usuariosRepositorio.updateRefreshToken(user._id.toString(), nuevoHashedRefresh);

  return {
    accessToken: nuevoAccessToken,
    refreshToken: nuevoRefreshToken,
    accessMaxAge: COOKIE_ACCESS_MAX_AGE,
    refreshMaxAge: COOKIE_REFRESH_MAX_AGE,
  };
}

export async function logout(userId: string): Promise<void> {
  await usuariosRepositorio.updateRefreshToken(userId, undefined);
}

export async function getMe(userId: string): Promise<IUser> {
  const user = await usuariosRepositorio.findById(userId);
  if (!user) throw new AppError(404, "Usuario no encontrado");
  return user;
}
