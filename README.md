# Proyecto Semana 02 — API CRUD Express (SENA Centro de Formación)

Entrega de semana 02 para `bc-expressjs`.

## Dominio asignado

**SENA — Centro de Formación** — recurso `Apprentice` (`nombre_completo`, `documento`, `ficha`, `estado`, `promedio_acumulado`, `costo_matricula`).

## Estructura

```
src/
├── app.ts                      # Configuración Express + middlewares
├── server.ts                   # Entry point + graceful shutdown
├── types.ts                    # Interfaces del dominio
├── store.ts                    # Store en memoria (CRUD)
└── routes/
    └── apprentices.routes.ts   # 5 endpoints CRUD
```

## Cómo correr

```bash
pnpm install
pnpm dev          # servidor en http://localhost:3000
pnpm build        # verifica TypeScript estricto
```

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/apprentices` | Listar todos | 200 |
| GET | `/api/v1/apprentices/:id` | Obtener por ID | 200 / 404 |
| POST | `/api/v1/apprentices` | Crear nuevo | 201 |
| PUT | `/api/v1/apprentices/:id` | Actualizar | 200 / 404 |
| DELETE | `/api/v1/apprentices/:id` | Eliminar | 204 / 404 |
| GET | `/health` | Health check | 200 |

## Middlewares implementados

1. `cors()` — habilitar CORS
2. `express.json()` — parseo de body JSON
3. `morgan("dev")` — logging de requests HTTP
4. **Logger personalizado** — método, URL, status, tiempo (ms)
5. **Handler 404** — rutas no encontradas
6. **Error handler global** — 4 parámetros, siempre último

## Pruebas con curl

```bash
# Listar todos
curl http://localhost:3000/api/v1/apprentices

# Obtener por ID
curl http://localhost:3000/api/v1/apprentices/1

# Crear
curl -X POST http://localhost:3000/api/v1/apprentices \
  -H "Content-Type: application/json" \
  -d '{"nombre_completo":"Nuevo Aprendiz","documento":"1234567890","programa_id":1,"ficha":"2765412","estado":"activo","fecha_ingreso":"2025-04-01","promedio_acumulado":4.0,"costo_matricula":1200000}'

# Actualizar
curl -X PUT http://localhost:3000/api/v1/apprentices/13 \
  -H "Content-Type: application/json" \
  -d '{"promedio_acumulado":4.5}'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/apprentices/13
```

## Decisiones de diseño

- **Store en memoria**: Array con datos iniciales (12 aprendices), sin base de datos.
- **Validación básica**: Campos obligatorios en POST (`nombre_completo`, `documento`, `ficha`).
- **Status codes correctos**: 200, 201, 204, 400, 404, 500 según corresponda.
- **Graceful shutdown**: Manejo de `SIGTERM` y `SIGINT` para cerrar el servidor limpiamente.
