// src/semilla.ts — Datos iniciales SENA Centro de Formación
// Ejecutar con: pnpm seed
// Inserta la entidad secundaria (Programa) primero, luego la principal
// (Aprendiz) referenciando los _id ya creados.

import "dotenv/config";
import { connectDB, disconnectDB } from "./config/mongoose.js";
import { Programa } from "./modelos/programa.modelo.js";
import { Aprendiz } from "./modelos/aprendiz.modelo.js";

async function semilla(): Promise<void> {
  await connectDB();

  await Aprendiz.deleteMany({});
  await Programa.deleteMany({});
  console.log("Colecciones limpiadas");

  const [ads, gestion, mecatronica, enfermeria] = await Programa.insertMany([
    { nombre: "Análisis y Desarrollo de Software", nivel: "Tecnólogo", duracionMeses: 24 },
    { nombre: "Gestión Empresarial", nivel: "Tecnólogo", duracionMeses: 18 },
    { nombre: "Mecatrónica Industrial", nivel: "Tecnólogo", duracionMeses: 24 },
    { nombre: "Enfermería", nivel: "Técnico", duracionMeses: 12 },
  ]);
  console.log(`✅ ${4} programas insertados`);

  const aprendices = await Aprendiz.insertMany([
    { nombreCompleto: "Valentina Ruiz", documento: "1010234567", ficha: "2765412", estado: "activo", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 4.5, costoMatricula: 1200000, programa: ads._id },
    { nombreCompleto: "Esteban Quintero", documento: "1020345678", ficha: "2765412", estado: "activo", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 4.2, costoMatricula: 1200000, programa: ads._id },
    { nombreCompleto: "Dayan Cárdenas", documento: "1030456789", ficha: "2765412", estado: "activo", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 4.8, costoMatricula: 1200000, programa: ads._id },
    { nombreCompleto: "Felipe Morales", documento: "1040567890", ficha: "2765412", estado: "retirado", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 3.1, costoMatricula: 1200000, programa: ads._id },
    { nombreCompleto: "Luz Marina Torres", documento: "1050678901", ficha: "2765413", estado: "activo", fechaIngreso: new Date("2025-02-01"), promedioAcumulado: 4.6, costoMatricula: 950000, programa: gestion._id },
    { nombreCompleto: "Andrés Felipe Ríos", documento: "1060789012", ficha: "2765413", estado: "graduado", fechaIngreso: new Date("2024-01-20"), promedioAcumulado: 4.9, costoMatricula: 950000, programa: gestion._id },
    { nombreCompleto: "Sofía Herrera", documento: "1070890123", ficha: "2765414", estado: "activo", fechaIngreso: new Date("2025-03-10"), promedioAcumulado: 3.9, costoMatricula: 1100000, programa: mecatronica._id },
    { nombreCompleto: "Daniel Castro", documento: "1080901234", ficha: "2765415", estado: "activo", fechaIngreso: new Date("2025-03-10"), promedioAcumulado: 4.3, costoMatricula: 800000, programa: enfermeria._id },
  ]);
  console.log(`✅ ${aprendices.length} aprendices insertados`);

  console.log("Semilla completada");
  await disconnectDB();
}

semilla().catch((err: unknown) => {
  console.error("❌ Error en la semilla:", err);
  process.exit(1);
});
