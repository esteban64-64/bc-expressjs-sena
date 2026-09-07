import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRouter from "./rutas/auth.rutas.js";
import aprendicesRouter from "./rutas/aprendices.rutas.js";
import programasRouter from "./rutas/programas.rutas.js";
import usuariosRouter from "./rutas/usuarios.rutas.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { sanitizarEntradas } from "./middlewares/sanitizar.js";
import { morganStream } from "./config/logger.js";
import { globalLimiter, corsOptions } from "./config/security.js";

const app: express.Application = express();

// Capas de seguridad — el orden importa
app.use(helmet());
app.use(globalLimiter);
app.use(cors(corsOptions));

// Middlewares globales
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev", { stream: morganStream }));

// Sanitizar entradas DESPUÉS de parsear el body, ANTES de las rutas
app.use(sanitizarEntradas);

// Rutas
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usuariosRouter);
app.use("/api/v1/programs", programasRouter);
app.use("/api/v1/apprentices", aprendicesRouter);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ estado: "ok", timestamp: new Date().toISOString() });
});

// 404 — SIEMPRE antes del errorHandler
app.use(notFound);

// Error handler global — SIEMPRE último, 4 parámetros
app.use(errorHandler);

export default app;
