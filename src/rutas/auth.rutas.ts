import { Router } from "express";
import * as authControlador from "../controladores/auth.controlador.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../config/security.js";

const router: Router = Router();

// Rutas públicas — register/login con rate limit estricto (fuerza bruta)
router.post("/register", authLimiter, authControlador.register);
router.post("/login", authLimiter, authControlador.login);
router.post("/refresh", authControlador.refresh);

// Rutas protegidas
router.get("/me", authMiddleware, authControlador.me);
router.post("/logout", authMiddleware, authControlador.logout);

export default router;
