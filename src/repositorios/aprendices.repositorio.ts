import type { Apprentice, CrearAprendizDto, ActualizarAprendizDto } from "../tipos.js";

/**
 * Repository — Única capa que toca el store.
 * Todos los métodos son async Promise<T>.
 * Devuelve copias defensivas para evitar mutaciones externas.
 */

let siguienteId = 13;

const aprendices: Apprentice[] = [
  { id: 1, nombre_completo: "Valentina Ruiz", documento: "1010234567", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.5, costo_matricula: 1200000, createdAt: "2025-01-15T00:00:00.000Z" },
  { id: 2, nombre_completo: "Esteban Quintero", documento: "1020345678", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.2, costo_matricula: 1200000, createdAt: "2025-01-15T00:00:00.000Z" },
  { id: 3, nombre_completo: "Dayan Cárdenas", documento: "1030456789", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.8, costo_matricula: 1200000, createdAt: "2025-01-15T00:00:00.000Z" },
  { id: 4, nombre_completo: "Felipe Morales", documento: "1040567890", programa_id: 1, ficha: "2765412", estado: "retirado", fecha_ingreso: "2025-01-15", promedio_acumulado: 3.1, costo_matricula: 1200000, createdAt: "2025-01-15T00:00:00.000Z" },
  { id: 5, nombre_completo: "Luz Marina Torres", documento: "1050678901", programa_id: 2, ficha: "2765413", estado: "activo", fecha_ingreso: "2025-02-01", promedio_acumulado: 4.6, costo_matricula: 950000, createdAt: "2025-02-01T00:00:00.000Z" },
  { id: 6, nombre_completo: "Andrés Felipe Ríos", documento: "1060789012", programa_id: 2, ficha: "2765413", estado: "graduado", fecha_ingreso: "2024-01-20", promedio_acumulado: 4.9, costo_matricula: 950000, createdAt: "2024-01-20T00:00:00.000Z" },
  { id: 7, nombre_completo: "Sofía Herrera", documento: "1070890123", programa_id: 3, ficha: "2765414", estado: "activo", fecha_ingreso: "2025-03-10", promedio_acumulado: 3.9, costo_matricula: 1100000, createdAt: "2025-03-10T00:00:00.000Z" },
  { id: 8, nombre_completo: "Daniel Castro", documento: "1080901234", programa_id: 4, ficha: "2765415", estado: "activo", fecha_ingreso: "2025-03-10", promedio_acumulado: 4.3, costo_matricula: 800000, createdAt: "2025-03-10T00:00:00.000Z" },
  { id: 9, nombre_completo: "Camila Mendoza", documento: "1091012345", programa_id: 2, ficha: "2765413", estado: "activo", fecha_ingreso: "2025-02-01", promedio_acumulado: 4.1, costo_matricula: 950000, createdAt: "2025-02-01T00:00:00.000Z" },
  { id: 10, nombre_completo: "Juan Pablo Vargas", documento: "1101123456", programa_id: 3, ficha: "2765414", estado: "activo", fecha_ingreso: "2025-03-10", promedio_acumulado: 4.0, costo_matricula: 1100000, createdAt: "2025-03-10T00:00:00.000Z" },
  { id: 11, nombre_completo: "Laura Gutiérrez", documento: "1111234567", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.7, costo_matricula: 1200000, createdAt: "2025-01-15T00:00:00.000Z" },
  { id: 12, nombre_completo: "Miguel Ángel Suárez", documento: "1121345678", programa_id: 4, ficha: "2765415", estado: "retirado", fecha_ingreso: "2025-03-10", promedio_acumulado: 2.8, costo_matricula: 800000, createdAt: "2025-03-10T00:00:00.000Z" }
];

function copiaDefensiva<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export async function obtenerTodos(): Promise<Apprentice[]> {
  return copiaDefensiva(aprendices);
}

export async function obtenerPorId(id: number): Promise<Apprentice | undefined> {
  const encontrado = aprendices.find((a) => a.id === id);
  return encontrado ? copiaDefensiva(encontrado) : undefined;
}

export async function crear(datos: CrearAprendizDto): Promise<Apprentice> {
  const aprendiz: Apprentice = {
    id: siguienteId++,
    ...datos,
    createdAt: new Date().toISOString(),
  };
  aprendices.push(aprendiz);
  return copiaDefensiva(aprendiz);
}

export async function actualizar(id: number, datos: ActualizarAprendizDto): Promise<Apprentice | undefined> {
  const idx = aprendices.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  aprendices[idx] = { ...aprendices[idx], ...datos };
  return copiaDefensiva(aprendices[idx]);
}

export async function eliminar(id: number): Promise<boolean> {
  const idx = aprendices.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  aprendices.splice(idx, 1);
  return true;
}

export async function contar(): Promise<number> {
  return aprendices.length;
}
