import type { Apprentice, ResumenAprendices } from "./tipos.js";

export function calcularResumen(aprendices: Apprentice[]): ResumenAprendices {
  const total = aprendices.length;
  const activos = aprendices.filter((a) => a.estado === "activo").length;
  const inactivos = aprendices.filter((a) => a.estado === "retirado").length;
  const graduados = aprendices.filter((a) => a.estado === "graduado").length;

  const costos = aprendices.map((a) => a.costo_matricula);
  const sumaCostos = costos.reduce((s, c) => s + c, 0);
  const promedioCosto = Math.round((sumaCostos / total) * 100) / 100;

  const costoMaximo = Math.max(...costos);
  const costoMinimo = Math.min(...costos);

  const aprendizMasCaro = aprendices.find((a) => a.costo_matricula === costoMaximo)!;
  const aprendizMasBarato = aprendices.find((a) => a.costo_matricula === costoMinimo)!;

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

export function filtrarPorCategoria(aprendices: Apprentice[], categoria: string): Apprentice[] {
  const estadosValidos = ["activo", "retirado", "graduado"];
  const categoriaNormalizada = categoria.toLowerCase().trim();

  if (!estadosValidos.includes(categoriaNormalizada)) {
    console.error(`Error: La categoría "${categoria}" no existe.`);
    console.error(`  Categorías disponibles: ${estadosValidos.join(", ")}`);
    process.exit(1);
  }

  return aprendices.filter((a) => a.estado === categoriaNormalizada);
}
