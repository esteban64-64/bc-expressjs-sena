/**
 * Tipos del dominio SENA — Centro de Formación
 * Entidades: Apprentices, Programs, Instructors, Competencies
 */

// ─── Aprendiz ───
export interface Apprentice {
  id: number;
  nombre_completo: string;
  documento: string;
  programa_id: number;
  ficha: string;
  estado: "activo" | "retirado" | "graduado";
  fecha_ingreso: string; // ISO 8601
  promedio_acumulado: number;
  costo_matricula: number; // Valor numérico para estadísticas
}

// ─── Programa de Formación ───
export interface Program {
  id: number;
  nombre: string;
  nivel: "Tecnólogo" | "Técnico" | "Auxiliar";
  duracion_meses: number;
  instructor_lider_id: number;
}

// ─── Instructor ───
export interface Instructor {
  id: number;
  nombre_completo: string;
  especialidad: string;
  correo: string;
  activo: boolean;
  anios_experiencia: number;
}

// ─── Competencia ───
export interface Competency {
  id: number;
  nombre: string;
  programa_id: number;
  duracion_horas: number;
  resultado_aprendizaje: string;
}

// ─── Dataset completo ───
export interface CentroFormacionDataset {
  meta: {
    centro: string;
    fecha_generacion: string;
    periodo: string;
  };
  programs: Program[];
  instructors: Instructor[];
  competencies: Competency[];
  apprentices: Apprentice[];
}

// ─── Reporte generado ───
export interface ReporteCentroFormacion {
  totalAprendices: number;
  activos: number;
  inactivos: number;
  graduados: number;
  promedioCostoMatricula: number;
  costoMaximo: number;
  costoMinimo: number;
  aprendicesFiltrados?: Apprentice[];
  filtroAplicado?: string;
  generadoEn: string;
}
