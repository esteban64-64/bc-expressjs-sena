import type { Request, Response, NextFunction, CookieOptions } from "express";
import * as authServicio from "../servicios/auth.servicio.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const esProduccion = process.env.NODE_ENV === "production";

function opcionesCookie(maxAge: number, path = "/"): CookieOptions {
  return {
    httpOnly: true,
    secure: esProduccion,
    sameSite: "lax",
    maxAge,
    path,
  };
}

function setearCookiesTokens(res: Response, tokens: Awaited<ReturnType<typeof authServicio.login>>): void {
  res.cookie("accessToken", tokens.accessToken, opcionesCookie(tokens.accessMaxAge));
  res.cookie("refreshToken", tokens.refreshToken, opcionesCookie(tokens.refreshMaxAge, "/api/v1/auth"));
}

function limpiarCookiesTokens(res: Response): void {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/v1/auth" });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    const user = await authServicio.register(parsed.data);
    res.status(201).json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }
    const tokens = await authServicio.login(parsed.data);
    setearCookiesTokens(res, tokens);
    res.status(200).json({ message: "Login exitoso" });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.sub;
    const user = await authServicio.getMe(userId);
    res.status(200).json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const incomingToken = req.cookies?.refreshToken as string | undefined;
    if (!incomingToken) {
      res.status(401).json({ error: "Refresh token no encontrado" });
      return;
    }
    const tokens = await authServicio.refresh(incomingToken);
    setearCookiesTokens(res, tokens);
    res.status(200).json({ message: "Tokens renovados" });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.sub;
    await authServicio.logout(userId);
    limpiarCookiesTokens(res);
    res.status(200).json({ message: "Sesión cerrada" });
  } catch (err) {
    next(err);
  }
}
