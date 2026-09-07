// src/semilla.ts — Datos iniciales SENA Centro de Formación
// Ejecutar con: pnpm seed
// Orden: usuarios demo -> Programa (secundaria) -> Aprendiz (principal,
// referenciando _id de programa y createdBy del usuario demo "user").

import "dotenv/config";
import bcrypt from "bcrypt";
import { connectDB, disconnectDB } from "./config/mongoose.js";
import { UserModel } from "./modelos/user.model.js";
import { Programa } from "./modelos/programa.modelo.js";
import { Aprendiz } from "./modelos/aprendiz.modelo.js";

const SALT_ROUNDS = 10;

async function semilla(): Promise<void> {
  await connectDB();

  await Aprendiz.deleteMany({});
  await Programa.deleteMany({});
  await UserModel.deleteMany({});
  console.log("Colecciones limpiadas");

  const passwordHash = await bcrypt.hash("Demo1234", SALT_ROUNDS);
  const [admin, instructor] = await UserModel.create([
    { email: "admin@sena.edu.co", password: passwordHash, name: "Admin SENA", role: "admin" },
    { email: "instructor@sena.edu.co", password: passwordHash, name: "Instructor SENA", role: "user" },
  ]);
  console.log("✅ 2 usuarios demo insertados (admin@sena.edu.co / instructor@sena.edu.co, password: Demo1234)");

  const [ads, gestion, mecatronica, enfermeria] = await Programa.insertMany([
    { nombre: "Análisis y Desarrollo de Software", nivel: "Tecnólogo", duracionMeses: 24 },
    { nombre: "Gestión Empresarial", nivel: "Tecnólogo", duracionMeses: 18 },
    { nombre: "Mecatrónica Industrial", nivel: "Tecnólogo", duracionMeses: 24 },
    { nombre: "Enfermería", nivel: "Técnico", duracionMeses: 12 },
  ]);
  console.log("✅ 4 programas insertados");

  const creadoPor = instructor._id.toString();
  const aprendices = await Aprendiz.insertMany([
    { nombreCompleto: "Valentina Ruiz", documento: "1010234567", ficha: "2765412", estado: "activo", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 4.5, costoMatricula: 1200000, programa: ads._id, createdBy: creadoPor },
    { nombreCompleto: "Esteban Quintero", documento: "1020345678", ficha: "2765412", estado: "activo", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 4.2, costoMatricula: 1200000, programa: ads._id, createdBy: creadoPor },
    { nombreCompleto: "Dayan Cárdenas", documento: "1030456789", ficha: "2765412", estado: "activo", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 4.8, costoMatricula: 1200000, programa: ads._id, createdBy: creadoPor },
    { nombreCompleto: "Felipe Morales", documento: "1040567890", ficha: "2765412", estado: "retirado", fechaIngreso: new Date("2025-01-15"), promedioAcumulado: 3.1, costoMatricula: 1200000, programa: ads._id, createdBy: creadoPor },
    { nombreCompleto: "Luz Marina Torres", documento: "1050678901", ficha: "2765413", estado: "activo", fechaIngreso: new Date("2025-02-01"), promedioAcumulado: 4.6, costoMatricula: 950000, programa: gestion._id, createdBy: creadoPor },
    { nombreCompleto: "Andrés Felipe Ríos", documento: "1060789012", ficha: "2765413", estado: "graduado", fechaIngreso: new Date("2024-01-20"), promedioAcumulado: 4.9, costoMatricula: 950000, programa: gestion._id, createdBy: creadoPor },
    { nombreCompleto: "Sofía Herrera", documento: "1070890123", ficha: "2765414", estado: "activo", fechaIngreso: new Date("2025-03-10"), promedioAcumulado: 3.9, costoMatricula: 1100000, programa: mecatronica._id, createdBy: creadoPor },
    { nombreCompleto: "Daniel Castro", documento: "1080901234", ficha: "2765415", estado: "activo", fechaIngreso: new Date("2025-03-10"), promedioAcumulado: 4.3, costoMatricula: 800000, programa: enfermeria._id, createdBy: creadoPor },
  ]);
  console.log(`✅ ${aprendices.length} aprendices insertados (createdBy: instructor@sena.edu.co)`);
  console.log(`(admin _id: ${admin._id.toString()})`);

  console.log("Semilla completada");
  await disconnectDB();
}

semilla().catch((err: unknown) => {
  console.error("❌ Error en la semilla:", err);
  process.exit(1);
});
