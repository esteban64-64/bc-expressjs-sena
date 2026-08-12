import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import type { Reporte } from "./tipos.js";

export async function escribirReporte(reporte: Reporte, ruta: string): Promise<void> {
  const rutaCompleta = resolve(import.meta.dirname, "..", ruta);
  await mkdir(dirname(rutaCompleta), { recursive: true });
  await writeFile(rutaCompleta, JSON.stringify(reporte, null, 2), "utf-8");
}
