import express, { Router } from "express";
import * as controlador from "../controladores/aprendices.controlador.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.js";

const router: express.Router = Router();

// Política de acceso (semana 08):
//   - Datos de aprendices son información personal (documento, nombre) —
//     TODAS las rutas requieren autenticación, ninguna es pública.
//   - GET/POST/PATCH: cualquier usuario autenticado (PATCH además exige
//     ser quien registró al aprendiz, o admin — verificado en el service).
//   - DELETE: solo admin.
router.use(authMiddleware);

router.get("/", controlador.listar);
router.get("/:id", controlador.obtenerPorId);
router.post("/", controlador.crear);
router.patch("/:id", controlador.actualizar);
router.delete("/:id", requireRole("admin"), controlador.eliminar);

export default router;
