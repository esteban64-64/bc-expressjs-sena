# Evidencia de ejecución — Semana 09

Ejecutado el 2026-09-06 con `pnpm test:coverage`.

```
Test Suites: 9 passed, 9 total
Tests:       91 passed, 91 total
```

## Cobertura global (umbral exigido: 80/70/80/80)

| Métrica | Cobertura | Umbral | Cumple |
|---|---|---|---|
| Statements | 93.11% | 80% | ✅ |
| Branches | 75.53% | 70% | ✅ |
| Functions | 98.68% | 80% | ✅ |
| Lines | 94.02% | 80% | ✅ |

`servicios/`, `rutas/`, `modelos/`, `schemas/` y `errors/` están al 100% en
las 4 métricas. Lo que queda por debajo del 100% son ramas de
configuración por entorno difíciles de accionar sin duplicar setup
(`config/logger.ts` con `NODE_ENV=development` vs producción) o guardas
defensivas ya cubiertas por otro camino equivalente.

## Estructura de la suite

```
src/
├── servicios/__tests__/
│   ├── aprendices.servicio.test.ts   (13 tests, unit — mocks del repositorio)
│   └── auth.servicio.test.ts         (12 tests, unit — mocks de bcrypt/jwt/repo)
├── repositorios/__tests__/
│   └── aprendices.repositorio.test.ts (7 tests — CastError/ValidationError
│                                        llamando el repositorio directo
│                                        contra Mongo real, sin pasar por Zod)
├── middlewares/__tests__/
│   ├── requireRole.test.ts    (3 tests, unit)
│   └── errorHandler.test.ts   (4 tests, unit)
├── utils/__tests__/
│   └── jwt.test.ts            (6 tests, unit — incluye ramas de secret faltante)
└── __tests__/
    ├── aprendices.routes.test.ts  (19 tests, integración — Supertest + MongoMemoryServer)
    ├── auth.routes.test.ts        (16 tests, integración — flujo completo login→me→refresh→logout)
    └── programas.routes.test.ts   (7 tests, integración)
```

## Hallazgo real durante el desarrollo de los tests

Escribir el test "crear debe lanzar AppError 400 cuando `programa` no es
un ObjectId válido" (llamando `aprendices.repositorio.crear()` **directo**,
sin pasar por el schema Zod que normalmente bloquea esto en la ruta HTTP)
reveló un bug genuino: `Model.create()` de Mongoose envuelve un ObjectId
mal formado en un `ValidationError`, no en un `CastError` directo — el
`catch` del repositorio solo comprobaba `instanceof CastError`, así que
este caso caía al `throw err` final y hubiera producido un 500 sin
manejar. Se corrigió agregando `instanceof mongoose.Error.ValidationError`
al `catch` de `crear()` en `src/repositorios/aprendices.repositorio.ts`.
Por la vía HTTP normal esto es inalcanzable (Zod ya lo bloquea antes), pero
es defensa en profundidad real para cualquier otro código que llame al
repositorio directamente.

## Nota técnica — Jest + ts-jest en un proyecto ESM (NodeNext)

Todo el proyecto usa `"type": "module"` + `moduleResolution: "NodeNext"`
desde la semana 01 (imports relativos con extensión `.js`, resueltos a los
`.ts` reales). El soporte "oficial" de ESM de Jest 29 (`useESM` +
`--experimental-vm-modules`) exige reescribir `jest.mock()` como
`jest.unstable_mockModule()` con `import()` dinámico en cada test — mucho
más fragil para un proyecto de bootcamp.

En su lugar, `tsconfig.jest.json` extiende el `tsconfig.json` del proyecto
pero fuerza `"module": "CommonJS"` (manteniendo `moduleResolution:
"NodeNext"`, que es lo que permite que `./foo.js` siga resolviendo a
`./foo.ts`). `ts-jest` transpila los tests a CommonJS con ese tsconfig, y
`moduleNameMapper` (`^(\.{1,2}/.*)\.js$` → `$1`) le dice a Jest que ignore
la extensión `.js` al resolver los `require()` resultantes. Con esto,
`jest.mock()` clásico funciona exactamente igual que en un proyecto CJS,
sin tocar una sola línea del código fuente de la aplicación (que sigue
compilando y ejecutándose en ESM real con `tsx`).

## Rate limiting en tests

`src/config/security.ts` desactiva `globalLimiter`/`authLimiter` cuando
`NODE_ENV=test` (`skip: () => process.env.NODE_ENV === "test"`). Sin esto,
una sola suite de integración con varios usuarios de fixture en
`beforeAll` agota el límite de 5 intentos/15min de `/auth/register` y
`/auth/login` y los tests fallan con 429 en vez de los códigos esperados.
No afecta a `development` ni `production`.
