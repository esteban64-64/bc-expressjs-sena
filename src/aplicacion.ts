import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import aprendicesRouter from "./rutas/aprendices.rutas.js";

const app: express.Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Logger personalizado
app.use((req: Request, res: Response, next: NextFunction) => {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duracion}ms`);
  });
  next();
});

// Rutas
app.use("/api/v1/apprentices", aprendicesRouter);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ estado: "ok", timestamp: new Date().toISOString() });
});

// Handler 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found", message: "Ruta no encontrada" });
});

// Error handler global (4 parámetros, SIEMPRE último)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error Handler]", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Error interno del servidor",
  });
});

export default app;
