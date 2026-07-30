import { readDataset } from "./reader.js";
import { summarize, filterByCategory } from "./processor.js";
import { writeReport } from "./writer.js";
import type { Report, Apprentice } from "./types.js";

function parseCategory(argv: string[]): string | undefined {
  const idx = argv.indexOf("--category");
  if (idx === -1) return undefined;
  return argv[idx + 1];
}

async function main(): Promise<void> {
  const category = parseCategory(process.argv.slice(2));
  const data = await readDataset("data/centro_formacion.json");
  let apprentices = data.apprentices;

  let filtrados: Apprentice[] | undefined;
  if (category) {
    filtrados = filterByCategory(apprentices, category);
    apprentices = filtrados;
  }

  const summary = summarize(apprentices);

  const report: Report = {
    summary,
    generadoEn: new Date().toISOString(),
  };

  if (category && filtrados) {
    report.filtroAplicado = category;
    report.filtrados = filtrados;
  }

  await writeReport(report, "output/report.json");

  console.log("\n🏫 RESUMEN DEL CENTRO DE FORMACIÓN SENA");
  console.log("=".repeat(50));
  if (category) {
    console.log(`📂 Filtro aplicado: estado = "${category}"`);
    console.log("");
  }
  console.log(`📊 Total aprendices      : ${summary.total}`);
  console.log(`🟢 Activos              : ${summary.activos}`);
  console.log(`🔴 Retirados (inactivos): ${summary.inactivos}`);
  console.log(`🎓 Graduados            : ${summary.graduados}`);
  console.log("");
  console.log(`💰 Promedio matrícula   : $${summary.promedioCosto.toLocaleString("es-CO")}`);
  console.log(`📈 Matrícula más alta   : $${summary.costoMaximo.toLocaleString("es-CO")} (${summary.aprendizMasCaro.nombre_completo})`);
  console.log(`📉 Matrícula más baja   : $${summary.costoMinimo.toLocaleString("es-CO")} (${summary.aprendizMasBarato.nombre_completo})`);
  console.log("=".repeat(50));
  console.log("\n✅ Reporte guardado en: output/report.json");
}

main().catch((err) => {
  console.error("Error inesperado:", err instanceof Error ? err.message : err);
  process.exit(1);
});
