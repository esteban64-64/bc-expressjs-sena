import express, { Router, type Request, type Response } from "express";
import * as almacen from "../almacen.js";
import type { ActualizarAprendizDto, Apprentice, CrearAprendizDto } from "../tipos.js";

const router: express.Router = Router();

const ESTADOS_VALIDOS: Apprentice["estado"][] = ["activo", "retirado", "graduado"];

function validarActualizacion(body: ActualizarAprendizDto): string | undefined {
  if (Object.keys(body).length === 0) {
    return "El cuerpo de la petición no puede estar vacío";
  }
  if ("nombre_completo" in body && typeof body.nombre_completo !== "string") {
    return "nombre_completo debe ser texto";
  }
  if ("documento" in body && typeof body.documento !== "string") {
    return "documento debe ser texto";
  }
  if ("ficha" in body && typeof body.ficha !== "string") {
    return "ficha debe ser texto";
  }
  if ("estado" in body && !ESTADOS_VALIDOS.includes(body.estado as Apprentice["estado"])) {
    return `estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}`;
  }
  return undefined;
}

// GET /api/v1/apprentices — Listar todos
router.get("/", (_req: Request, res: Response) => {
  const aprendices = almacen.obtenerTodos();
  res.status(200).json({
    exito: true,
    cantidad: aprendices.length,
    datos: aprendices,
  });
});

// GET /api/v1/apprentices/:id — Obtener por ID
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ exito: false, mensaje: "ID inválido" });
    return;
  }

  const aprendiz = almacen.obtenerPorId(id);
  if (!aprendiz) {
    res.status(404).json({ exito: false, mensaje: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(200).json({ exito: true, datos: aprendiz });
});

// POST /api/v1/apprentices — Crear
router.post("/", (req: Request, res: Response) => {
  const body = req.body as CrearAprendizDto;

  if (!body.nombre_completo || !body.documento || !body.ficha) {
    res.status(400).json({ exito: false, mensaje: "Faltan campos obligatorios: nombre_completo, documento, ficha" });
    return;
  }

  const aprendiz = almacen.crear(body);
  res.status(201).json({ exito: true, datos: aprendiz });
});

// PUT /api/v1/apprentices/:id — Actualizar
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ exito: false, mensaje: "ID inválido" });
    return;
  }

  const body = req.body as ActualizarAprendizDto;
  const error = validarActualizacion(body);
  if (error) {
    res.status(400).json({ exito: false, mensaje: error });
    return;
  }

  const aprendiz = almacen.actualizar(id, body);

  if (!aprendiz) {
    res.status(404).json({ exito: false, mensaje: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(200).json({ exito: true, datos: aprendiz });
});

// DELETE /api/v1/apprentices/:id — Eliminar
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ exito: false, mensaje: "ID inválido" });
    return;
  }

  const eliminado = almacen.eliminar(id);
  if (!eliminado) {
    res.status(404).json({ exito: false, mensaje: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(204).send();
});

export default router;