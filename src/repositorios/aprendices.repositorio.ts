import { Prisma, type Apprentice } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";
import type { CrearAprendizInput, ActualizarAprendizInput } from "../schemas/aprendiz.schema.js";

type AprendizConPrograma = Apprentice & { program: { id: string; nombre: string; nivel: string } };

export async function obtenerTodos(
  page: number,
  limit: number
): Promise<{ data: AprendizConPrograma[]; total: number }> {
  const [data, total] = await Promise.all([
    prisma.apprentice.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { program: { select: { id: true, nombre: true, nivel: true } } },
    }),
    prisma.apprentice.count(),
  ]);
  return { data, total };
}

export async function obtenerPorId(id: string): Promise<AprendizConPrograma | null> {
  return prisma.apprentice.findUnique({
    where: { id },
    include: { program: { select: { id: true, nombre: true, nivel: true } } },
  });
}

export async function crear(datos: CrearAprendizInput): Promise<Apprentice> {
  try {
    return await prisma.apprentice.create({ data: datos });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") throw new AppError(409, "Ya existe un aprendiz con ese documento");
      if (err.code === "P2003") throw new AppError(400, "El programId no corresponde a un programa existente");
    }
    throw err;
  }
}

export async function actualizar(id: string, datos: ActualizarAprendizInput): Promise<Apprentice> {
  try {
    return await prisma.apprentice.update({ where: { id }, data: datos });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") throw new AppError(404, "Aprendiz no encontrado");
      if (err.code === "P2002") throw new AppError(409, "Ya existe un aprendiz con ese documento");
      if (err.code === "P2003") throw new AppError(400, "El programId no corresponde a un programa existente");
    }
    throw err;
  }
}

export async function eliminar(id: string): Promise<void> {
  try {
    await prisma.apprentice.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      throw new AppError(404, "Aprendiz no encontrado");
    }
    throw err;
  }
}
