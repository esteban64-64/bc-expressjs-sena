import express, { Router } from "express";
import * as controlador from "../controladores/aprendices.controlador.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router: express.Router = Router();

// Todas las rutas de aprendices requieren autenticación (semana 07)
router.use(authMiddleware);

router.get("/", controlador.listar);
router.get("/:id", controlador.obtenerPorId);
router.post("/", controlador.crear);
router.patch("/:id", controlador.actualizar);
router.delete("/:id", controlador.eliminar);

export default router;
