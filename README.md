# Semana 4 — Validación Zod, AppError y Logging con Winston (SENA Centro de Formación)

API REST en **Express 5 + TypeScript** con arquitectura en capas, validación
con **Zod**, manejo de errores con **AppError** y logging con **Winston**.

**Dominio**: SENA Centro de Formación
**Recurso implementado**: Apprentice

## Estructura

```
src/
├── config/
│   └── logger.ts              # Winston: niveles, formatos, transports
├── errors/
│   └── AppError.ts            # Clase para errores HTTP operacionales
├── middlewares/
│   ├── errorHandler.ts        # Distingue ZodError, AppError, genérico
│   └── notFound.ts            # Lanza AppError(404) antes del errorHandler
├── schemas/
│   └── aprendiz.schema.ts     # Schemas Zod + tipos inferidos
├── repositorios/
│   └── aprendices.repositorio.ts
├── servicios/
│   └── aprendices.servicio.ts
├── controladores/
│   └── aprendices.controlador.ts
├── rutas/
│   └── aprendices.rutas.ts
├── aplicacion.ts              # Express app con middlewares en orden correcto
└── servidor.ts                # Entry point con logger.info()
```

## Instalación y ejecución

```bash
pnpm install
pnpm dev          # servidor en http://localhost:3000
pnpm build        # verifica TypeScript estricto
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/apprentices?page=1&limit=5` | Listar paginado |
| GET | `/api/v1/apprentices/:id` | Obtener por ID |
| POST | `/api/v1/apprentices` | Crear nuevo |
| PUT | `/api/v1/apprentices/:id` | Actualizar |
| DELETE | `/api/v1/apprentices/:id` | Eliminar |
| GET | `/health` | Health check |

## Validación con Zod

### POST /api/v1/apprentices
```json
{
  "nombre_completo": "string (requerido)",
  "documento": "string (min 5 chars)",
  "programa_id": 1,
  "ficha": "string (requerido)",
  "estado": "activo | retirado | graduado",
  "fecha_ingreso": "YYYY-MM-DD",
  "promedio_acumulado": 4.5,
  "costo_matricula": 1200000
}
```

### Respuesta de error Zod (400)
```json
{
  "error": "Bad Request",
  "message": "Datos de entrada inválidos",
  "issues": [
    { "path": ["nombre_completo"], "message": "El nombre completo es obligatorio" }
  ]
}
```

## AppError

```typescript
throw new AppError(404, "Aprendiz no encontrado");      // isOperational = true
throw new AppError(500, "Error crítico", false);        // isOperational = false
```

## Logging con Winston

| Entorno | Nivel | Formato | Archivo |
|---------|-------|---------|---------|
| Development | `http` | Colorizado | Consola |
| Production | `warn` | JSON | `logs/error.log` |

## Middlewares en orden

1. `cors()`
2. `express.json()`
3. `morgan("dev")` → stream de Winston
4. **Routes**
5. **notFound** → lanza AppError(404)
6. **errorHandler** → 4 parámetros, SIEMPRE último

## Pruebas con curl

```bash
# Crear válido
curl -X POST http://localhost:3000/api/v1/apprentices \
  -H "Content-Type: application/json" \
  -d '{"nombre_completo":"Nuevo","documento":"12345678","programa_id":1,"ficha":"2765412","estado":"activo","fecha_ingreso":"2025-04-01","promedio_acumulado":4.0,"costo_matricula":1200000}'

# Crear inválido (falta nombre_completo)
curl -X POST http://localhost:3000/api/v1/apprentices \
  -H "Content-Type: application/json" \
  -d '{"documento":"12345678"}'

# ID inválido
curl http://localhost:3000/api/v1/apprentices/abc

# Ruta no existe
curl http://localhost:3000/api/v1/noexiste
```

## Decisiones de diseño

- **Zod safeParse**: No se usa directamente en controllers; se usa `.parse()` que lanza ZodError, capturado por el errorHandler.
- **AppError.isOperational**: Distingue errores esperados (404, 400) de errores críticos (500).
- **Morgan + Winston**: Morgan usa el stream de Winston para unificar logs.
- **notFound antes de errorHandler**: Garantiza que rutas no encontradas pasen por el errorHandler.
