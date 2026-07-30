import type { Apprentice, CreateApprenticeDto } from "./types.js";

/**
 * Store en memoria — Base de datos temporal para aprendices SENA
 */

let nextId = 13;

const apprentices: Apprentice[] = [
  { id: 1, nombre_completo: "Valentina Ruiz", documento: "1010234567", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.5, costo_matricula: 1200000 },
  { id: 2, nombre_completo: "Esteban Quintero", documento: "1020345678", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.2, costo_matricula: 1200000 },
  { id: 3, nombre_completo: "Dayan Cárdenas", documento: "1030456789", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.8, costo_matricula: 1200000 },
  { id: 4, nombre_completo: "Felipe Morales", documento: "1040567890", programa_id: 1, ficha: "2765412", estado: "retirado", fecha_ingreso: "2025-01-15", promedio_acumulado: 3.1, costo_matricula: 1200000 },
  { id: 5, nombre_completo: "Luz Marina Torres", documento: "1050678901", programa_id: 2, ficha: "2765413", estado: "activo", fecha_ingreso: "2025-02-01", promedio_acumulado: 4.6, costo_matricula: 950000 },
  { id: 6, nombre_completo: "Andrés Felipe Ríos", documento: "1060789012", programa_id: 2, ficha: "2765413", estado: "graduado", fecha_ingreso: "2024-01-20", promedio_acumulado: 4.9, costo_matricula: 950000 },
  { id: 7, nombre_completo: "Sofía Herrera", documento: "1070890123", programa_id: 3, ficha: "2765414", estado: "activo", fecha_ingreso: "2025-03-10", promedio_acumulado: 3.9, costo_matricula: 1100000 },
  { id: 8, nombre_completo: "Daniel Castro", documento: "1080901234", programa_id: 4, ficha: "2765415", estado: "activo", fecha_ingreso: "2025-03-10", promedio_acumulado: 4.3, costo_matricula: 800000 },
  { id: 9, nombre_completo: "Camila Mendoza", documento: "1091012345", programa_id: 2, ficha: "2765413", estado: "activo", fecha_ingreso: "2025-02-01", promedio_acumulado: 4.1, costo_matricula: 950000 },
  { id: 10, nombre_completo: "Juan Pablo Vargas", documento: "1101123456", programa_id: 3, ficha: "2765414", estado: "activo", fecha_ingreso: "2025-03-10", promedio_acumulado: 4.0, costo_matricula: 1100000 },
  { id: 11, nombre_completo: "Laura Gutiérrez", documento: "1111234567", programa_id: 1, ficha: "2765412", estado: "activo", fecha_ingreso: "2025-01-15", promedio_acumulado: 4.7, costo_matricula: 1200000 },
  { id: 12, nombre_completo: "Miguel Ángel Suárez", documento: "1121345678", programa_id: 4, ficha: "2765415", estado: "retirado", fecha_ingreso: "2025-03-10", promedio_acumulado: 2.8, costo_matricula: 800000 }
];

export function getAll(): Apprentice[] {
  return apprentices;
}

export function getById(id: number): Apprentice | undefined {
  return apprentices.find((a) => a.id === id);
}

export function create(data: CreateApprenticeDto): Apprentice {
  const apprentice: Apprentice = { id: nextId++, ...data };
  apprentices.push(apprentice);
  return apprentice;
}

export function update(id: number, data: Partial<CreateApprenticeDto>): Apprentice | undefined {
  const idx = apprentices.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  apprentices[idx] = { ...apprentices[idx], ...data };
  return apprentices[idx];
}

export function remove(id: number): boolean {
  const idx = apprentices.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  apprentices.splice(idx, 1);
  return true;
}
