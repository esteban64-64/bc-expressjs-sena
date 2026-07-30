import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import apprenticesRouter from "./routes/apprentices.routes.js";

const app = express();

// 1. Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 2. Logger personalizado (muestra método, URL, status y tiempo)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// 3. Rutas
app.use("/api/v1/apprentices", apprenticesRouter);

// 4. Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 5. Handler 404 — rutas no encontradas
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

// 6. Error handler global — SIEMPRE último, 4 parámetros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error Handler]", err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
