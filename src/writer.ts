import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import type { Report } from "./types.js";

export async function writeReport(report: Report, filePath: string): Promise<void> {
  const fullPath = resolve(import.meta.dirname, "..", filePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, JSON.stringify(report, null, 2), "utf-8");
}
