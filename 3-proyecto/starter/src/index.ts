import type { CentroFormacionDataset, ReporteCentroFormacion, Apprentice } from "./types.js";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";

/**
 * Procesador de Datos — SENA Centro de Formación
 * Requisitos oficiales del bootcamp:
 *   1. Leer datos desde JSON (fs/promises)
 *   2. Mostrar resumen: total, activos/inactivos, promedio, max, min
 *   3. Filtrar por categoría vía CLI (--category)
 *   4. Generar reporte en output/report.json
 *   5. Manejo de errores (archivo no existe, categoría inexistente)
 */

const DATA_PATH = resolve(import.meta.dirname, "../data/centro_formacion.json");
const OUTPUT_DIR = resolve(import.meta.dirname, "../output");
const OUTPUT_JSON = resolve(OUTPUT_DIR, "report.json");

// ─── Parsear argumentos de CLI ───
function parseArgs(): { category?: string } {
  const args = process.argv.slice(2);
  const categoryIdx = args.indexOf("--category");
  const category = categoryIdx !== -1 ? args[categoryIdx + 1] : undefined;
  return { category };
}

// ─── Leer dataset ───
async function leerDataset(): Promise<CentroFormacionDataset> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as CentroFormacionDataset;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(`❌ Error: No se encontró el archivo de datos en:
   ${DATA_PATH}`);
    } else {
      console.error("❌ Error al leer el archivo:", err instanceof Error ? err.message : err);
    }
    process.exit(1);
  }
}

// ─── Calcular resumen ───
function calcularResumen(apprentices: Apprentice[]): {
  total: number;
  activos: number;
  inactivos: number;
  graduados: number;
  promedioCosto: number;
  costoMaximo: number;
  costoMinimo: number;
  aprendizMasCaro: Apprentice;
  aprendizMasBarato: Apprentice;
} {
  const total = apprentices.length;
  const activos = apprentices.filter((a) => a.estado === "activo").length;
  const inactivos = apprentices.filter((a) => a.estado === "retirado").length;
  const graduados = apprentices.filter((a) => a.estado === "graduado").length;

  const costos = apprentices.map((a) => a.costo_matricula);
  const sumaCostos = costos.reduce((s, c) => s + c, 0);
  const promedioCosto = Math.round((sumaCostos / total) * 100) / 100;

  const costoMaximo = Math.max(...costos);
  const costoMinimo = Math.min(...costos);

  const aprendizMasCaro = apprentices.find((a) => a.costo_matricula === costoMaximo)!;
  const aprendizMasBarato = apprentices.find((a) => a.costo_matricula === costoMinimo)!;

  return {
    total,
    activos,
    inactivos,
    graduados,
    promedioCosto,
    costoMaximo,
    costoMinimo,
    aprendizMasCaro,
    aprendizMasBarato,
  };
}

// ─── Filtrar por categoría (estado del aprendiz) ───
function filtrarPorCategoria(apprentices: Apprentice[], category: string): Apprentice[] {
  const estadosValidos = ["activo", "retirado", "graduado"];
  const categoriaNormalizada = category.toLowerCase().trim();

  if (!estadosValidos.includes(categoriaNormalizada)) {
    console.error(`❌ Error: La categoría "${category}" no existe.`);
    console.error(`   Categorías disponibles: ${estadosValidos.join(", ")}`);
    process.exit(1);
  }

  return apprentices.filter((a) => a.estado === categoriaNormalizada);
}

// ─── Mostrar resumen en consola ───
function mostrarResumen(
  resumen: ReturnType<typeof calcularResumen>,
  filtro?: string
): void {
  console.log("\n🏫 RESUMEN DEL CENTRO DE FORMACIÓN SENA");
  console.log("=".repeat(50));

  if (filtro) {
    console.log(`📂 Filtro aplicado: estado = "${filtro}"`);
    console.log("");
  }

  console.log(`📊 Total aprendices      : ${resumen.total}`);
  console.log(`🟢 Activos              : ${resumen.activos}`);
  console.log(`🔴 Retirados (inactivos): ${resumen.inactivos}`);
  console.log(`🎓 Graduados            : ${resumen.graduados}`);
  console.log("");
  console.log(`💰 Promedio matrícula   : $${resumen.promedioCosto.toLocaleString("es-CO")}`);
  console.log(`📈 Matrícula más alta   : $${resumen.costoMaximo.toLocaleString("es-CO")} (${resumen.aprendizMasCaro.nombre_completo})`);
  console.log(`📉 Matrícula más baja   : $${resumen.costoMinimo.toLocaleString("es-CO")} (${resumen.aprendizMasBarato.nombre_completo})`);
  console.log("=".repeat(50));
}

// ─── Generar reporte JSON ───
async function generarReporte(
  resumen: ReturnType<typeof calcularResumen>,
  filtrados?: Apprentice[],
  filtro?: string
): Promise<void> {
  const reporte: ReporteCentroFormacion = {
    totalAprendices: resumen.total,
    activos: resumen.activos,
    inactivos: resumen.inactivos,
    graduados: resumen.graduados,
    promedioCostoMatricula: resumen.promedioCosto,
    costoMaximo: resumen.costoMaximo,
    costoMinimo: resumen.costoMinimo,
    generadoEn: new Date().toISOString(),
  };

  if (filtro && filtrados) {
    reporte.filtroAplicado = filtro;
    reporte.aprendicesFiltrados = filtrados;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_JSON, JSON.stringify(reporte, null, 2), "utf-8");
  console.log(`\n✅ Reporte guardado en: output/report.json`);
}

// ─── MAIN ───
async function main(): Promise<void> {
  const { category } = parseArgs();

  console.log("🏫 Procesador de Datos — SENA Centro de Formación");
  if (category) {
    console.log(`🔍 Filtrando por categoría: "${category}"`);
  }

  // 1. Leer datos
  const data = await leerDataset();
  let apprentices = data.apprentices;

  // 2. Filtrar si hay categoría
  let filtrados: Apprentice[] | undefined;
  if (category) {
    filtrados = filtrarPorCategoria(apprentices, category);
    apprentices = filtrados;
  }

  // 3. Calcular resumen
  const resumen = calcularResumen(apprentices);

  // 4. Mostrar en consola
  mostrarResumen(resumen, category);

  // 5. Generar reporte JSON
  await generarReporte(resumen, filtrados, category);

  console.log("\n🎉 Procesamiento completado exitosamente");
}

main().catch((err) => {
  console.error("❌ Error inesperado:", err instanceof Error ? err.message : err);
  process.exit(1);
});
