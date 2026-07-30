import express, { type Request, type Response } from "express";

const app = express();
app.use(express.json());

const PORT = 3000;

// Datos en memoria
let items = [
  { id: 1, name: "Item A" },
  { id: 2, name: "Item B" },
];

// GET /items
app.get("/items", (_req: Request, res: Response) => {
  res.json(items);
});

// GET /items/:id
app.get("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = items.find((i) => i.id === id);
  if (!item) {
    res.status(404).json({ message: "Item no encontrado" });
    return;
  }
  res.json(item);
});

// POST /items
app.post("/items", (req: Request, res: Response) => {
  const newItem = { id: items.length + 1, ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /items/:id
app.put("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    res.status(404).json({ message: "Item no encontrado" });
    return;
  }
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

// DELETE /items/:id
app.delete("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    res.status(404).json({ message: "Item no encontrado" });
    return;
  }
  items.splice(idx, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🚀 Ejercicio 01 corriendo en http://localhost:${PORT}`);
});
