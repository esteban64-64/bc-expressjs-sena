import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { CentroFormacionDataset } from "./types.js";

export async function readDataset(filePath: string): Promise<CentroFormacionDataset> {
  const fullPath = resolve(import.meta.dirname, "..", filePath);
  try {
    const raw = await readFile(fullPath, "utf-8");
    return JSON.parse(raw) as CentroFormacionDataset;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(`Error: No se encontró el archivo de datos en: ${fullPath}`);
    } else {
      console.error("Error al leer el archivo:", err instanceof Error ? err.message : err);
    }
    process.exit(1);
  }
}
