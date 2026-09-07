# Semana 8 — API Segura con RBAC y Capas de Seguridad (SENA Centro de Formación)

Sobre la autenticación JWT de la semana 07, se agregan las capas de
seguridad completas: Helmet, rate limiting diferenciado, CORS con
whitelist, sanitización de entradas y RBAC con roles (`user`/`admin`) más
verificación de propietario.

**Dominio**: SENA Centro de Formación
**Recurso protegido**: `Aprendiz` — `/api/v1/apprentices`

## Roles y permisos

| Rol | Puede |
|---|---|
| `user` (ej. un instructor) | Ver, crear aprendices; editar (`PATCH`) **solo los que él registró** (`createdBy`) |
| `admin` | Todo lo anterior + editar cualquier aprendiz + **eliminar** cualquiera |

> Decisión de diseño: los datos de aprendices son información personal
> (nombre, documento) — **ninguna ruta de `apprentices` es pública**, a
> diferencia del ejemplo genérico del spec. `Programa` (catálogo, semana
> 06) sigue público, fuera del alcance de esta semana.

## Endpoints

| Método | Ruta | Acceso | Status |
|--------|------|--------|--------|
| GET | `/api/v1/apprentices` | Autenticado | 200 / 401 |
| GET | `/api/v1/apprentices/:id` | Autenticado | 200 / 401 / 404 |
| POST | `/api/v1/apprentices` | Autenticado | 201 / 401 / 400 / 409 |
| PATCH | `/api/v1/apprentices/:id` | Autenticado + dueño **o** admin | 200 / 401 / 403 / 404 |
| DELETE | `/api/v1/apprentices/:id` | Autenticado + **admin** | 204 / 401 / 403 / 404 |
| GET | `/api/v1/users/dashboard` | Autenticado | 200 / 401 |
| POST | `/api/v1/auth/register`, `/login` | Público, con rate limit estricto (5/15min) | — |

## Capas de seguridad (`src/config/security.ts`, `src/aplicacion.ts`)

1. **Helmet** — headers de seguridad en todas las respuestas (`X-Content-Type-Options`, `X-Frame-Options`, etc.).
2. **Rate limiting** — `globalLimiter` (100 req/15min, todas las rutas) y `authLimiter` (5 req/15min, solo `/auth/register` y `/auth/login`, protección contra fuerza bruta).
3. **CORS con whitelist** — solo `http://localhost:5173` y `http://localhost:3001` (nunca `cors()` sin opciones ni `origin: '*'`), con `credentials: true` para las cookies HttpOnly.
4. **Sanitización NoSQL** — `src/middlewares/sanitizar.ts` limpia `body`/`params`/`query` de claves con `$` o `.` antes de llegar a las rutas (ver nota técnica abajo sobre por qué no se usa el middleware por defecto).
5. **RBAC** — `authMiddleware` (semana 07) + `requireRole('admin')` (nuevo) para `DELETE`; verificación de propietario (`createdBy`) en `src/servicios/aprendices.servicio.ts` para `PATCH`.
6. **Errores sin stack trace en producción** — heredado del `errorHandler` de semana 04: en `NODE_ENV=production` el 500 genérico no expone `err.message`.

## Instalación y ejecución

```bash
docker compose up -d
pnpm install
cp .env.example .env    # agrega JWT_ACCESS_SECRET / JWT_REFRESH_SECRET
pnpm seed                # crea admin@sena.edu.co / instructor@sena.edu.co (password: Demo1234)
pnpm dev
```

## Ver [`docs/evidencia.md`](./docs/evidencia.md)

Headers de Helmet/rate-limit, flujo RBAC completo (401 → 200 dueño → 403
no-dueño → 403 no-admin → 204 admin), CORS bloqueando un origen no
permitido, e intento de inyección NoSQL en login rechazado por Zod antes
de tocar la base de datos — todo probado con curl contra MongoDB real.
