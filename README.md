# Semana 5 — API con PostgreSQL y Prisma ORM (SENA Centro de Formación)

Migración de la API de aprendices desde almacenamiento en memoria (semana 04)
a **PostgreSQL** usando **Prisma ORM**, con migraciones versionadas y seed
idempotente.

**Dominio**: SENA Centro de Formación
**Recurso principal** (expuesto en la API): `Apprentice` (aprendiz)
**Recurso secundario** (relación 1:N): `Program` (programa) — un programa
tiene muchos aprendices

## Modelo de datos

```
Program (1) ──< (N) Apprentice
  id, nombre, nivel, duracionMeses          id, nombreCompleto, documento (único),
                                             ficha, estado, fechaIngreso,
                                             promedioAcumulado, costoMatricula,
                                             programId (FK)
```

Toda PK/FK es `String @db.Uuid` (`@default(uuid())`), según la convención del
bootcamp — nunca `Int @default(autoincrement())`.

## Estructura

```
prisma/
├── schema.prisma       # Modelos Program y Apprentice
└── seed.ts             # 4 programas + 8 aprendices (idempotente)
src/
├── lib/prisma.ts             # Singleton de PrismaClient
├── config/logger.ts          # Winston (heredado de semana 04)
├── errors/AppError.ts
├── middlewares/{errorHandler,notFound}.ts
├── schemas/aprendiz.schema.ts   # Zod — programId validado como UUID
├── repositorios/aprendices.repositorio.ts  # Prisma CRUD + P2002/P2003/P2025
├── servicios/aprendices.servicio.ts
├── controladores/aprendices.controlador.ts  # .safeParse() en los 5 handlers
├── rutas/aprendices.rutas.ts
├── aplicacion.ts
└── servidor.ts
```

## Instalación y ejecución

Requiere Docker (para PostgreSQL), Node 22+ y pnpm.

```bash
docker compose up -d                      # levanta PostgreSQL en :5432
pnpm install
cp .env.example .env
pnpm dlx prisma migrate dev --name init   # crea prisma/migrations/
pnpm dlx prisma db seed                   # inserta programas + aprendices
pnpm dev                                  # servidor en http://localhost:3000
```

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/apprentices?page=1&limit=10` | Listado paginado (incluye `program`) | 200 |
| GET | `/api/v1/apprentices/:id` | Detalle con `program` | 200 / 404 |
| POST | `/api/v1/apprentices` | Crear (Zod) | 201 / 400 / 409 |
| PUT | `/api/v1/apprentices/:id` | Actualizar | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/apprentices/:id` | Eliminar | 204 / 404 |
| GET | `/health` | Health check | 200 |

### Ejemplo — crear aprendiz

```bash
curl -X POST http://localhost:3000/api/v1/apprentices \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCompleto": "Nuevo Aprendiz",
    "documento": "99999999",
    "programId": "<uuid-de-un-program>",
    "ficha": "2765412",
    "estado": "activo",
    "fechaIngreso": "2025-04-01",
    "promedioAcumulado": 4.0,
    "costoMatricula": 1200000
  }'
```

Respuesta 201:
```json
{
  "data": {
    "id": "b6a1...uuid",
    "nombreCompleto": "Nuevo Aprendiz",
    "documento": "99999999",
    "ficha": "2765412",
    "estado": "activo",
    "fechaIngreso": "2025-04-01T00:00:00.000Z",
    "promedioAcumulado": 4,
    "costoMatricula": 1200000,
    "programId": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Manejo de errores de Prisma

| Código Prisma | Situación | Respuesta |
|---|---|---|
| `P2002` | `documento` duplicado | `409 AppError` |
| `P2003` | `programId` no existe (FK inválida) | `400 AppError` |
| `P2025` | Actualizar/eliminar un `id` inexistente | `404 AppError` |

Todos pasan por el `errorHandler` global (heredado de semana 04, sin cambios).

## Ver [`docs/evidencia.md`](./docs/evidencia.md)

Logs reales de `prisma migrate dev`, `prisma db seed` y capturas de los 5
endpoints contra la base de datos levantada localmente.
