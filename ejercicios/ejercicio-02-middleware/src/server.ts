import express, { type Request, type Response, type NextFunction } from "express";

const app = express();
const PORT = 3000;

// Middleware 1: Logger — registra método, URL y timestamp
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware 2: Auth ficticio — verifica header x-api-key
app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== "sena-2026") {
    res.status(401).json({ message: "Unauthorized: x-api-key inválida" });
    return;
  }
  next();
});

// Middleware 3: Tiempo de respuesta
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`⏱️  Request procesado en ${Date.now() - start}ms`);
  });
  next();
});

// Ruta protegida
app.get("/dashboard", (_req: Request, res: Response) => {
  res.json({ message: "Bienvenido al dashboard del SENA" });
});

// Handler 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Error handler global (4 parámetros, SIEMPRE último)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[Error]", err.message);
  res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`🛡️  Ejercicio 02 corriendo en http://localhost:${PORT}`);
  console.log(`Prueba con: curl -H "x-api-key: sena-2026" http://localhost:${PORT}/dashboard`);
});
