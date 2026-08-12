import { leerDataset } from "./lector.js";
import { calcularResumen, filtrarPorCategoria } from "./procesador.js";
import { escribirReporte } from "./escritor.js";
import type { Reporte, Apprentice } from "./tipos.js";

function parsearCategoria(argv: string[]): string | undefined {
  const idx = argv.indexOf("--category");
  if (idx === -1) return undefined;
  return argv[idx + 1];
}

async function main(): Promise<void> {
  const categoria = parsearCategoria(process.argv.slice(2));
  const data = await leerDataset("datos/centro_formacion.json");
  let aprendices = data.apprentices;

  let filtrados: Apprentice[] | undefined;
  if (categoria) {
    filtrados = filtrarPorCategoria(aprendices, categoria);
    aprendices = filtrados;
  }

  const resumen = calcularResumen(aprendices);

  const reporte: Reporte = {
    resumen,
    generadoEn: new Date().toISOString(),
  };

  if (categoria && filtrados) {
    reporte.filtroAplicado = categoria;
    reporte.filtrados = filtrados;
  }

  await escribirReporte(reporte, "salida/reporte.json");

  console.log("\n🏫 RESUMEN DEL CENTRO DE FORMACIÓN SENA");
  console.log("=".repeat(50));
  if (categoria) {
    console.log(`📂 Filtro aplicado: estado = "${categoria}"`);
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
  console.log("\n✅ Reporte guardado en: salida/reporte.json");
}

main().catch((err) => {
  console.error("Error inesperado:", err instanceof Error ? err.message : err);
  process.exit(1);
});
