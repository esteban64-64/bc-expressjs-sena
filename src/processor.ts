import type { Apprentice, Summary } from "./types.js";

export function summarize(apprentices: Apprentice[]): Summary {
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

export function filterByCategory(apprentices: Apprentice[], category: string): Apprentice[] {
  const estadosValidos = ["activo", "retirado", "graduado"];
  const categoriaNormalizada = category.toLowerCase().trim();

  if (!estadosValidos.includes(categoriaNormalizada)) {
    console.error(`Error: La categoría "${category}" no existe.`);
    console.error(`  Categorías disponibles: ${estadosValidos.join(", ")}`);
    process.exit(1);
  }

  return apprentices.filter((a) => a.estado === categoriaNormalizada);
}
