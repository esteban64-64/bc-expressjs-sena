# Evidencia de ejecución — Semana 06

Ejecutado el 2026-09-06 contra una instancia real de MongoDB en
`localhost:27017` (base `sena_centro_formacion`).

## `pnpm seed`

```
🍃 MongoDB conectado
Colecciones limpiadas
✅ 4 programas insertados
✅ 8 aprendices insertados
Semilla completada
```

## Pruebas de los endpoints (curl)

| Prueba | Resultado |
|---|---|
| `GET /api/v1/programs` | `200` |
| `GET /api/v1/apprentices?page=1&limit=2&search=Ruiz` | `200`, con `programa` populado |
| `POST /api/v1/apprentices` (válido) | `201` |
| `POST /api/v1/apprentices` (documento duplicado) | `409 Conflict` |
| `POST /api/v1/apprentices` (`programa` con formato válido pero inexistente) | `400 Bad Request` |
| `GET /api/v1/apprentices/:id` (id con formato inválido) | `400` (Zod, antes de llegar a Mongo) |
| `PUT /api/v1/apprentices/:id` | `200`, con `programa` populado |
| `DELETE /api/v1/apprentices/:id` | `204` |
| `GET` del aprendiz recién eliminado | `404 Not Found` |
| `POST /api/v1/programs` (nombre duplicado, vía Zod) | rechazado |
| `POST /api/v1/programs` (válido) | `201` |
| `PUT /api/v1/programs/:id` | `200`, sin warning de deprecación de Mongoose |

### GET con `populate` + `search`

```json
{
  "data": [
    {
      "_id": "6a9e0c2ca7fd77df533c23ba",
      "nombreCompleto": "Valentina Ruiz",
      "documento": "1010234567",
      "estado": "activo",
      "programa": {
        "_id": "6a9e0c2ca7fd77df533c23b6",
        "nombre": "Análisis y Desarrollo de Software",
        "nivel": "Tecnólogo",
        "duracionMeses": 24
      }
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### POST con documento duplicado → 409

```json
{ "error": "Conflict", "message": "Ya existe un aprendiz con ese documento" }
```

### POST con `programa` inexistente (formato válido, ObjectId no existe) → 400

```json
{ "error": "Bad Request", "message": "El programa indicado no existe" }
```

## Nota técnica

Se corrigió `{ new: true }` → `{ returnDocument: "after" }` en
`findByIdAndUpdate` de ambos repositorios: Mongoose 9.4.1 marca `new` como
deprecado en favor de `returnDocument`. Verificado que el warning
desaparece y el comportamiento (devolver el documento actualizado) se
mantiene igual.
