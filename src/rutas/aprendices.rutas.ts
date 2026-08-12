import { Router } from "express";
import * as controlador from "../controladores/aprendices.controlador.js";

/**
 * Routes — Solo mapeo URL → controller function.
 */

const router = Router();

router.get("/", controlador.listar);
router.get("/:id", controlador.obtenerPorId);
router.post("/", controlador.crear);
router.put("/:id", controlador.actualizar);
router.delete("/:id", controlador.eliminar);

export default router;
