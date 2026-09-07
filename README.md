# Semana 6 — API REST con MongoDB y Mongoose (SENA Centro de Formación)

Migración de la persistencia de PostgreSQL/Prisma (semana 05) a **MongoDB +
Mongoose**, con dos entidades relacionadas, `populate()`, paginación y
manejo de errores de Mongo (`11000`, `CastError`).

**Dominio**: SENA Centro de Formación
**Entidad secundaria** (sin referencias): `Programa` — `/api/v1/programs`
**Entidad principal** (referencia a `Programa`): `Aprendiz` — `/api/v1/apprentices`

## Modelo de datos

```
Programa (colección "programs")        Aprendiz (colección "apprentices")
  nombre (único), nivel,          <──┐    nombreCompleto, documento (único),
  duracionMeses                      └── programa: ObjectId ref Programa
                                          ficha, estado, fechaIngreso,
                                          promedioAcumulado, costoMatricula
```

## Estructura

```
src/
├── config/{logger,mongoose}.ts        # Winston + connectDB/disconnectDB
├── modelos/{programa,aprendiz}.modelo.ts
├── errors/AppError.ts
├── middlewares/{errorHandler,notFound}.ts
├── schemas/{programa,aprendiz}.schema.ts
├── repositorios/{programas,aprendices}.repositorio.ts  # 11000/CastError/404
├── servicios/{programas,aprendices}.servicio.ts        # valida que el
│                                                          programa exista
├── controladores/{programas,aprendices}.controlador.ts # .safeParse()
├── rutas/{programas,aprendices}.rutas.ts
├── aplicacion.ts
├── servidor.ts       # connectDB() antes de listen
└── semilla.ts        # inserta programas primero, luego aprendices
```

## Instalación y ejecución

Requiere MongoDB (Docker o instalación local), Node 22+ y pnpm.

```bash
docker compose up -d              # levanta MongoDB en :27017
pnpm install
cp .env.example .env
pnpm seed                         # 4 programas + 8 aprendices
pnpm dev                          # servidor en http://localhost:3000
```

## Endpoints

### Programas (secundaria)

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/programs` | Listar todos | 200 |
| GET | `/api/v1/programs/:id` | Obtener por ID | 200 / 400 / 404 |
| POST | `/api/v1/programs` | Crear | 201 / 400 / 409 |
| PUT | `/api/v1/programs/:id` | Actualizar | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/programs/:id` | Eliminar | 204 / 400 / 404 |

### Aprendices (principal, con populate)

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/apprentices?page=1&limit=10&search=texto` | Paginado + `populate(programa)` | 200 |
| GET | `/api/v1/apprentices/:id` | Con `programa` populado | 200 / 400 / 404 |
| POST | `/api/v1/apprentices` | Valida que `programa` exista | 201 / 400 / 409 |
| PUT | `/api/v1/apprentices/:id` | Actualizar | 200 / 400 / 404 / 409 |
| DELETE | `/api/v1/apprentices/:id` | Eliminar | 204 / 400 / 404 |

## Manejo de errores de Mongo/Mongoose

| Situación | Respuesta |
|---|---|
| Código Mongo `11000` (campo único duplicado: `documento` o `nombre`) | `409 AppError` |
| `CastError` (ObjectId con formato inválido) | `400 AppError` (además el schema Zod ya rechaza formatos inválidos antes de llegar aquí) |
| `programa` con formato válido pero que no existe | `400 AppError` (verificado en el servicio con `Programa.exists()`) |
| Documento no encontrado (`findById`/`findByIdAndUpdate`/`findByIdAndDelete` → `null`) | `404 AppError` |

Todos pasan por el `errorHandler` global (heredado, sin cambios).

## Ver [`docs/evidencia.md`](./docs/evidencia.md)

Logs reales de `pnpm seed` y de probar los 5 endpoints de `apprentices`
(incluyendo `populate`, 400 por `programa` inválido y 409 por duplicado)
contra una instancia real de MongoDB.
