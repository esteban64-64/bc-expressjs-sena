import express, { type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";
import aprendicesRouter from "./rutas/aprendices.rutas.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { morganStream } from "./config/logger.js";

const app: express.Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev", { stream: morganStream }));

// Rutas
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
