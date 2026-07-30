import { Router, type Request, type Response, type NextFunction } from "express";
import * as store from "../store.js";
import type { CreateApprenticeDto } from "../types.js";

const router = Router();

// GET /api/v1/apprentices — Listar todos
router.get("/", (_req: Request, res: Response) => {
  const apprentices = store.getAll();
  res.status(200).json({
    success: true,
    count: apprentices.length,
    data: apprentices,
  });
});

// GET /api/v1/apprentices/:id — Obtener por ID
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: "ID inválido" });
    return;
  }

  const apprentice = store.getById(id);
  if (!apprentice) {
    res.status(404).json({ success: false, message: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(200).json({ success: true, data: apprentice });
});

// POST /api/v1/apprentices — Crear
router.post("/", (req: Request, res: Response) => {
  const body = req.body as CreateApprenticeDto;

  // Validación básica
  if (!body.nombre_completo || !body.documento || !body.ficha) {
    res.status(400).json({ success: false, message: "Faltan campos obligatorios: nombre_completo, documento, ficha" });
    return;
  }

  const apprentice = store.create(body);
  res.status(201).json({ success: true, data: apprentice });
});

// PUT /api/v1/apprentices/:id — Actualizar completo
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: "ID inválido" });
    return;
  }

  const body = req.body as Partial<CreateApprenticeDto>;
  const apprentice = store.update(id, body);

  if (!apprentice) {
    res.status(404).json({ success: false, message: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(200).json({ success: true, data: apprentice });
});

// DELETE /api/v1/apprentices/:id — Eliminar
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ success: false, message: "ID inválido" });
    return;
  }

  const deleted = store.remove(id);
  if (!deleted) {
    res.status(404).json({ success: false, message: `Aprendiz con id ${id} no encontrado` });
    return;
  }

  res.status(204).send();
});

export default router;
