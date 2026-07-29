import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
/**
 * Utilidades de filesystem
 */
export async function leerJSON(relativePath) {
    const fullPath = resolve(import.meta.dirname, relativePath);
    const raw = await readFile(fullPath, "utf-8");
    return JSON.parse(raw);
}
export async function escribirJSON(relativePath, data) {
    const fullPath = resolve(import.meta.dirname, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
}
export async function escribirTexto(relativePath, content) {
    const fullPath = resolve(import.meta.dirname, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, "utf-8");
}
//# sourceMappingURL=utils.js.map