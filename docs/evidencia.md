# Evidencia de ejecución — Semana 07

Ejecutado el 2026-09-06 contra una instancia real de MongoDB en
`localhost:27017`, con `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET`
distintos, siguiendo el flujo completo indicado en el spec.

| Paso | Petición | Resultado |
|---|---|---|
| 1 | `GET /api/v1/apprentices` (sin cookie) | `401` — `No autenticado — token no encontrado` |
| 2 | `POST /api/v1/auth/register` | `201` |
| 3 | `POST /api/v1/auth/register` (mismo email) | `409 Conflict` |
| 4 | `POST /api/v1/auth/login` | `200`, cookies `accessToken` (HttpOnly, path `/`) y `refreshToken` (HttpOnly, path `/api/v1/auth`) |
| 5 | `GET /api/v1/auth/me` (con cookie) | `200` |
| 6 | `GET /api/v1/apprentices?limit=2` (con cookie) | `200` |
| 7 | `POST /api/v1/apprentices` (con cookie) | `201` |
| 8 | `PATCH /api/v1/apprentices/:id` (con cookie) | `200` |
| 9 | `DELETE /api/v1/apprentices/:id` (con cookie) | `204` |
| 10 | `POST /api/v1/auth/refresh` | `200` — nuevas cookies (rotación) |
| 11 | `POST /api/v1/auth/logout` | `200` — cookies limpiadas |
| 12 | `POST /api/v1/auth/refresh` (después de logout) | `401` — refresh token ya no disponible |

## Cookies emitidas en login (formato Netscape, valores JWT reales omitidos parcialmente)

```
#HttpOnly_localhost  FALSE  /api/v1/auth  FALSE  <exp>  refreshToken  eyJhbGciOi...
#HttpOnly_localhost  FALSE  /             FALSE  <exp>  accessToken   eyJhbGciOi...
```

Ambas cookies llevan el flag `HttpOnly` (confirmado por el prefijo
`#HttpOnly_` que agrega curl al parsear el header `Set-Cookie`) — nunca
son accesibles desde JavaScript del lado del cliente.

## Checklist de criterios de seguridad obligatorios

| Criterio | Cumple |
|---|---|
| Contraseñas hasheadas con `bcrypt.hash()` (10 salt rounds) | ✅ `auth.servicio.ts` |
| `JWT_ACCESS_SECRET` ≠ `JWT_REFRESH_SECRET` | ✅ variables separadas en `.env` |
| Tokens solo en cookies HttpOnly (nunca en el body ni localStorage) | ✅ confirmado arriba |
| Refresh token hasheado en DB (nunca en claro) | ✅ `bcrypt.hash(refreshToken, ...)` antes de `updateRefreshToken` |
| Rotación de refresh token en cada `/refresh` | ✅ paso 10, nuevo hash reemplaza al anterior |
| Todas las rutas de `apprentices` protegidas con `authMiddleware` | ✅ `router.use(authMiddleware)` en `aprendices.rutas.ts` |
| Sin secrets hardcodeados (solo en `.env`) | ✅ `.env` está en `.gitignore`, solo `.env.example` con placeholders |
