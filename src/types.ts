/**
 * Tipos del dominio SENA — Centro de Formación
 * Entidades: Apprentices, Programs, Instructors, Competencies
 */

export interface Apprentice {
  id: number;
  nombre_completo: string;
  documento: string;
  programa_id: number;
  ficha: string;
  estado: "activo" | "retirado" | "graduado";
  fecha_ingreso: string;
  promedio_acumulado: number;
  costo_matricula: number;
}

export interface Program {
  id: number;
  nombre: string;
  nivel: "Tecnólogo" | "Técnico" | "Auxiliar";
  duracion_meses: number;
  instructor_lider_id: number;
}

export interface Instructor {
  id: number;
  nombre_completo: string;
  especialidad: string;
  correo: string;
  activo: boolean;
  anios_experiencia: number;
}

export interface Competency {
  id: number;
  nombre: string;
  programa_id: number;
  duracion_horas: number;
  resultado_aprendizaje: string;
}

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

export interface Summary {
  total: number;
  activos: number;
  inactivos: number;
  graduados: number;
  promedioCosto: number;
  costoMaximo: number;
  costoMinimo: number;
  aprendizMasCaro: Apprentice;
  aprendizMasBarato: Apprentice;
}

export interface Report {
  summary: Summary;
  filtrados?: Apprentice[];
  filtroAplicado?: string;
  generadoEn: string;
}
