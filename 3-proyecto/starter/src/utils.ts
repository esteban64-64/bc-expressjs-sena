import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";

/**
 * Utilidades de filesystem
 */

export async function leerJSON<T>(relativePath: string): Promise<T> {
  const fullPath = resolve(import.meta.dirname, relativePath);
  const raw = await readFile(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function escribirJSON<T>(relativePath: string, data: T): Promise<void> {
  const fullPath = resolve(import.meta.dirname, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function escribirTexto(relativePath: string, content: string): Promise<void> {
  const fullPath = resolve(import.meta.dirname, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, "utf-8");
}
