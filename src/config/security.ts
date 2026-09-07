import rateLimit from "express-rate-limit";
import type { CorsOptions } from "cors";

// Limiter global — todos los endpoints: 100 req / 15 min
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones, intenta de nuevo más tarde" },
});

// Limiter de auth — login/register: 5 req / 15 min (protección contra fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Demasiados intentos de inicio de sesión, intenta más tarde" },
});

// CORS whitelist — orígenes permitidos del frontend
const ORIGENES_PERMITIDOS = ["http://localhost:5173", "http://localhost:3001"];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ORIGENES_PERMITIDOS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado: origen ${origin} no permitido`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
