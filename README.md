# Semana 7 — Autenticación JWT completa (SENA Centro de Formación)

Se agrega un sistema de autenticación completo (bcrypt + JWT access/refresh
+ cookies HttpOnly) sobre la API de MongoDB/Mongoose de la semana 06, y se
protegen todas las rutas del recurso principal (`Aprendiz`) con
`authMiddleware`.

**Dominio**: SENA Centro de Formación
**Recurso protegido**: `Aprendiz` (aprendiz) — `/api/v1/apprentices`

## Autenticación

| Método | Ruta | Descripción | Protegida |
|--------|------|-------------|:---:|
| POST | `/api/v1/auth/register` | Registro (hash de contraseña) | No |
| POST | `/api/v1/auth/login` | Login → cookies `accessToken` + `refreshToken` (HttpOnly) | No |
| GET | `/api/v1/auth/me` | Perfil del usuario autenticado | Sí |
| POST | `/api/v1/auth/refresh` | Renueva tokens con rotación de refresh token | No* |
| POST | `/api/v1/auth/logout` | Invalida el refresh token y limpia cookies | Sí |

\* `/refresh` no usa `authMiddleware` (el access token ya expiró); valida el
refresh token recibido en su propia cookie.

## CRUD de Aprendiz (todas las rutas requieren `authMiddleware`)

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/apprentices?page=1&limit=10&search=texto` | Listar (paginado + populate) | 200 / 401 |
| GET | `/api/v1/apprentices/:id` | Obtener por ID | 200 / 401 / 404 |
| POST | `/api/v1/apprentices` | Crear | 201 / 401 / 400 / 409 |
| PATCH | `/api/v1/apprentices/:id` | Actualización parcial | 200 / 401 / 404 |
| DELETE | `/api/v1/apprentices/:id` | Eliminar | 204 / 401 / 404 |

`Programa` (`/api/v1/programs`, entidad secundaria de la semana 06) queda
sin cambios y sigue pública — la semana 07 solo exige proteger el recurso
principal.

## Estructura (nuevo en esta semana)

```
src/
├── modelos/user.model.ts          # email, password (select:false), name, role
├── utils/jwt.ts                   # sign/verify access (15m) y refresh (7d)
├── types/express.d.ts             # req.user tipado globalmente
├── middlewares/auth.middleware.ts # valida accessToken de la cookie
├── repositorios/usuarios.repositorio.ts
├── schemas/auth.schema.ts         # register/login con Zod
├── servicios/auth.servicio.ts     # register/login/refresh/logout/getMe
├── controladores/auth.controlador.ts  # setea/limpia cookies HttpOnly
└── rutas/auth.rutas.ts
```

## Criterios de seguridad implementados

- Contraseñas: `bcrypt.hash()` con 10 salt rounds.
- `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` son secrets **distintos**.
- Tokens **solo** en cookies `HttpOnly` (nunca en el body de la respuesta
  ni en `localStorage`).
- El refresh token se guarda **hasheado** en Mongo (`user.refreshToken`),
  nunca en texto plano.
- Cada `/refresh` **rota** el refresh token: genera uno nuevo y reemplaza
  el hash anterior, invalidando el token usado.
- Mismo mensaje de error para "email no existe" y "contraseña incorrecta"
  en login (previene enumeración de usuarios).

## Instalación y ejecución

```bash
docker compose up -d              # MongoDB en :27017
pnpm install
cp .env.example .env
# Generar y pegar en .env:
#   JWT_ACCESS_SECRET=$(openssl rand -base64 64)
#   JWT_REFRESH_SECRET=$(openssl rand -base64 64)
pnpm seed
pnpm dev
```

## Ver [`docs/evidencia.md`](./docs/evidencia.md)

Flujo completo probado con curl contra MongoDB real: registro → login →
`/me` → CRUD protegido (401 sin cookie, luego 201/200/204 con cookie) →
refresh (rotación) → logout → refresh posterior (401).
