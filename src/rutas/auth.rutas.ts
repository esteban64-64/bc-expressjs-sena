import { Router } from "express";
import * as authControlador from "../controladores/auth.controlador.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: Router = Router();

// Rutas públicas
router.post("/register", authControlador.register);
router.post("/login", authControlador.login);
router.post("/refresh", authControlador.refresh);

// Rutas protegidas
router.get("/me", authMiddleware, authControlador.me);
router.post("/logout", authMiddleware, authControlador.logout);

export default router;
