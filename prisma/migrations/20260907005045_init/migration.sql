-- CreateTable
CREATE TABLE "programs" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "duracionMeses" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apprentices" (
    "id" UUID NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "ficha" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "promedioAcumulado" DOUBLE PRECISION NOT NULL,
    "costoMatricula" DOUBLE PRECISION NOT NULL,
    "programId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apprentices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_nombre_key" ON "programs"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "apprentices_documento_key" ON "apprentices"("documento");

-- AddForeignKey
ALTER TABLE "apprentices" ADD CONSTRAINT "apprentices_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
