import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { CentroFormacionDataset } from "./tipos.js";

export async function leerDataset(ruta: string): Promise<CentroFormacionDataset> {
  const rutaCompleta = resolve(import.meta.dirname, "..", ruta);
  try {
    const raw = await readFile(rutaCompleta, "utf-8");
    return JSON.parse(raw) as CentroFormacionDataset;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(`Error: No se encontró el archivo de datos en: ${rutaCompleta}`);
    } else {
      console.error("Error al leer el archivo:", err instanceof Error ? err.message : err);
    }
    process.exit(1);
  }
}
