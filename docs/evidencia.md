# Evidencia de ejecución — Semana 05

Ejecutado el 2026-09-06 contra un PostgreSQL 18 real en `localhost:5432`
(base `sena_centro_formacion`, usuario `sena`).

## `prisma migrate dev --name init`

```
Datasource "db": PostgreSQL database "sena_centro_formacion", schema "public" at "localhost:5432"

Applying migration `20260907005045_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20260907005045_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

## `prisma db seed`

```
🌱 Iniciando seed...
✅ 4 programas creados
✅ 8 aprendices creados
```

## Prueba de los 5 endpoints (curl)

| Prueba | Resultado |
|---|---|
| `GET /api/v1/apprentices?page=1&limit=3` | `200`, incluye `program` populado |
| `POST /api/v1/apprentices` (válido) | `201` |
| `POST /api/v1/apprentices` (documento duplicado) | `409 Conflict` |
| `POST /api/v1/apprentices` (`programId` inexistente) | `400 Bad Request` |
| `PUT /api/v1/apprentices/:id` | `200` |
| `GET /api/v1/apprentices/:id` (id inexistente) | `404 Not Found` |
| `DELETE /api/v1/apprentices/:id` | `204 No Content` |

### GET listado (con `program` populado)

```json
{
  "data": [
    {
      "id": "b6dbf8f5-6dbc-4aca-86d8-609191716d54",
      "nombreCompleto": "Esteban Quintero",
      "documento": "1020345678",
      "estado": "activo",
      "programId": "db1d98b3-9275-43f9-82b3-471761812206",
      "program": { "id": "db1d98b3-9275-43f9-82b3-471761812206", "nombre": "Análisis y Desarrollo de Software", "nivel": "Tecnólogo" }
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 3
}
```

### POST con documento duplicado → 409

```json
{ "error": "Conflict", "message": "Ya existe un aprendiz con ese documento" }
```

### POST con `programId` inexistente → 400

```json
{ "error": "Bad Request", "message": "El programId no corresponde a un programa existente" }
```

### DELETE → 204, luego GET del mismo id → 404

```json
{ "error": "Not Found", "message": "Aprendiz no encontrado" }
```
