# Semana 9 — Testing con Jest y Supertest (SENA Centro de Formación)

Suite completa de tests para la API construida en las semanas 06-08
(MongoDB/Mongoose, JWT, RBAC y seguridad): unit tests de los servicios con
mocks, integration tests de las rutas con Supertest + MongoDB Memory
Server, y cobertura ≥ 80% (statements/functions/lines) y ≥ 70% (branches).

**Dominio**: SENA Centro de Formación
**Recurso principal probado**: `Aprendiz` (`aprendices.servicio.ts`, rutas `/api/v1/apprentices`)

## Comandos

```bash
pnpm install
pnpm test              # ejecutar todos los tests
pnpm test:watch        # modo watch
pnpm test:coverage     # reporte de cobertura → coverage/lcov-report/index.html
```

No requiere Docker ni MongoDB corriendo — `mongodb-memory-server` descarga
y levanta un `mongod` real y efímero por cada suite de integración.

## Qué se probó

### Unit tests (`src/servicios/__tests__/`)

- **`aprendices.servicio.test.ts`** (13 tests): `listarPaginado`,
  `obtenerPorId`, `crear` (valida que el programa exista), `actualizar`
  (dueño ✅ / admin ✅ / ni dueño ni admin → 403 / 404 propagado / nuevo
  programa inexistente → 400), `eliminar`. Repositorio y modelo `Programa`
  mockeados con `jest.mock()`.
- **`auth.servicio.test.ts`** (12 tests): `register`, `login`, `refresh`
  (rotación, token inválido, sesión no válida, hash no coincide),
  `logout`, `getMe`. `bcrypt`, `jwt.ts` y el repositorio de usuarios
  mockeados — nunca toca una base de datos real ni corre bcrypt real.

### Integration tests (`src/__tests__/`)

- **`aprendices.routes.test.ts`** (19 tests): el ciclo completo pedido por
  el spec — `GET` sin/con auth, `POST` válido/401/400/409/400 (programa
  inexistente), `GET /:id` 200/404/400, `PATCH` dueño/no-dueño(403)/404,
  `DELETE` admin(204)/no-admin(403)/404 — más un smoke test del CRUD
  público de `Programa`.
- **`auth.routes.test.ts`** (16 tests): register/login/duplicado/password
  débil/credenciales inválidas, y el flujo `login → /me → /refresh
  (rotación) → /logout → /refresh` (401, ya invalidado) — igual que se
  verificó manualmente con curl en la semana 07.
- **`programas.routes.test.ts`** (7 tests): duplicado (409), body inválido
  (400), ID inválido (400), actualizar/eliminar inexistente (404).

### Otros unit tests dirigidos a cobertura de ramas

- **`repositorios/__tests__/aprendices.repositorio.test.ts`**: llama los
  repositorios **directamente** (sin pasar por Zod) para forzar
  `CastError`/`ValidationError` reales de Mongoose — ver el hallazgo real
  documentado en `docs/evidencia.md`.
- **`middlewares/__tests__/{requireRole,errorHandler}.test.ts`** y
  **`utils/__tests__/jwt.test.ts`**: ramas defensivas (sin `req.user`, sin
  secret configurado, `isOperational: false`, mensaje de error en
  desarrollo vs. producción) que la API nunca alcanza por HTTP porque
  otras capas ya las bloquean antes.

## `clearMocks` y limpieza de estado entre tests

- `jest.config.cjs`: `clearMocks: true` (todos los `jest.fn()` se
  resetean automáticamente entre tests).
- Integration tests: `afterEach` limpia solo la colección bajo prueba
  (ej. `Aprendiz.deleteMany({})`), preservando los usuarios/tokens de
  fixture creados una vez en `beforeAll`; `afterAll` desconecta Mongo y
  detiene el `MongoMemoryServer`.

## Ver [`docs/evidencia.md`](./docs/evidencia.md)

Tabla de cobertura completa, el bug real que reveló escribir los tests
(`ValidationError` no manejado en `aprendices.repositorio.crear()`), y la
nota técnica sobre cómo se hizo funcionar `jest.mock()` clásico en un
proyecto ESM/NodeNext sin reescribir todo a `jest.unstable_mockModule`.
