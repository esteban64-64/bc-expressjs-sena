import express, { Router } from "express";
import * as controlador from "../controladores/aprendices.controlador.js";

const router: express.Router = Router();

router.get("/", controlador.listar);
router.get("/:id", controlador.obtenerPorId);
router.post("/", controlador.crear);
router.put("/:id", controlador.actualizar);
router.delete("/:id", controlador.eliminar);

export default router;