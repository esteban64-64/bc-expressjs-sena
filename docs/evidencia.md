# Evidencia de ejecución — Semana 08

Ejecutado el 2026-09-06 contra MongoDB real, con usuarios demo creados por
`pnpm seed` (`admin@sena.edu.co` rol `admin`, `instructor@sena.edu.co` rol
`user`, password `Demo1234` para ambos).

## Headers de seguridad (Helmet + rate limit) — `GET /health`

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
RateLimit-Policy: 100;w=900
RateLimit: limit=100, remaining=99, reset=900
```

## Flujo RBAC

| Petición | Resultado |
|---|---|
| `GET /api/v1/apprentices` sin cookie | `401` |
| Login `instructor@sena.edu.co` (rol `user`) | `200` |
| Login `admin@sena.edu.co` (rol `admin`) | `200` |
| `PATCH` de un aprendiz **registrado por el propio instructor** | `200` |
| `DELETE` por `instructor` (no es admin) | `403 Forbidden — Roles requeridos: admin` |
| `DELETE` por `admin` | `204` |
| Registro de un segundo usuario `otro@sena.edu.co` (rol `user` por defecto) | `201` |
| `PATCH` de `otro@sena.edu.co` sobre un aprendiz que **no registró** (es de `instructor`) | `403 Forbidden — Solo puedes editar los aprendices que tú registraste` |

## CORS con whitelist

| Origen | Resultado |
|---|---|
| `http://evil.com` | Bloqueado (`CORS bloqueado: origen ... no permitido`, sin header `Access-Control-Allow-Origin`) |
| `http://localhost:5173` (en la whitelist) | Permitido — `Access-Control-Allow-Origin: http://localhost:5173` |

## Sanitización NoSQL

`POST /api/v1/auth/login` con `password: { "$ne": null }` (intento clásico
de bypass de autenticación vía operador Mongo) → `400 Bad Request` por Zod
(`password` debe ser `string`, no `object`) — nunca llega a construir una
query Mongo con el operador.

## Nota técnica — incompatibilidad `express-mongo-sanitize` + Express 5

El middleware por defecto de `express-mongo-sanitize@2.2.0` hace
internamente `req.query = target` para "reemplazar" el query sanitizado.
En Express 5, `req.query` es un **getter sin setter**, así que esa
reasignación lanza en cada petición:

```
Cannot set property query of #<IncomingMessage> which has only a getter
```

Se reemplazó por `src/middlewares/sanitizar.ts`, que usa la función pura
`sanitize()` de la misma librería (limpia el objeto **en el sitio**, sin
reasignar `req.body`/`req.params`/`req.query`). Mismo resultado de
sanitización, compatible con Express 5.
