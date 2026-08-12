# Semana 3 — API REST con Arquitectura en Capas (SENA Centro de Formación)

API REST en **Express 5 + TypeScript** con arquitectura en **4 capas**:
`routes → controllers → services → repositories`.

**Dominio**: SENA Centro de Formación
**Recurso implementado**: Apprentice (`nombre_completo`, `documento`, `ficha`, `estado`, `promedio_acumulado`, `costo_matricula`)

## Estructura

```
src/
├── tipos.ts                          # Interfaces, DTOs, contratos de respuesta
├── repositorios/
│   └── aprendices.repositorio.ts     # Store en memoria, async, copias defensivas
├── servicios/
│   └── aprendices.servicio.ts        # Lógica de negocio, paginación, validaciones
├── controladores/
│   └── aprendices.controlador.ts     # 3 pasos: extraer → service → responder
├── rutas/
│   └── aprendices.rutas.ts           # Solo mapeo URL → controller
├── aplicacion.ts                     # Configuración Express + middlewares
└── servidor.ts                       # Entry point + graceful shutdown
```

## Instalación y ejecución

Requiere Node.js 22+ y pnpm.

```bash
pnpm install
pnpm dev          # servidor en http://localhost:3000
pnpm build        # verifica TypeScript estricto
```

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/apprentices?page=1&limit=5` | Listar paginado | 200 |
| GET | `/api/v1/apprentices/:id` | Obtener por ID | 200 / 404 |
| POST | `/api/v1/apprentices` | Crear nuevo | 201 / 400 |
| PUT | `/api/v1/apprentices/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/v1/apprentices/:id` | Eliminar | 204 / 404 |
| GET | `/health` | Health check | 200 |

## Contratos de respuesta

### Listado paginado (GET /api/v1/apprentices)
```json
{
  "data": [...],
  "total": 12,
  "page": 1,
  "limit": 5
}
```

### Individual (GET /api/v1/apprentices/:id, POST, PUT)
```json
{
  "data": { ... }
}
```

### Error
```json
{
  "error": "Not Found",
  "message": "Aprendiz con id 999 no encontrado"
}
```

## Reglas de la arquitectura

| Capa | Responsabilidad | Reglas |
|------|-----------------|--------|
| **Repository** | Acceso a datos | Única capa que toca el store. Todos los métodos son `async`. Devuelve copias defensivas. |
| **Service** | Lógica de negocio | Sin imports de Express. Paginación y validaciones de dominio. |
| **Controller** | HTTP | Exactamente 3 pasos: extraer datos del request → llamar service → responder con contrato. |
| **Routes** | Mapeo | Solo mapea URL → controller function. Sin lógica. |

## Pruebas con curl

```bash
# Listar paginado
curl "http://localhost:3000/api/v1/apprentices?page=1&limit=5"

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

- **Arquitectura en capas**: Separación clara de responsabilidades entre routes, controllers, services y repositories.
- **Async/await en repository**: Prepara la arquitectura para cuando se reemplace el store por una base de datos real.
- **Copias defensivas**: El repository devuelve copias para evitar que el service o controller muten el store directamente.
- **Paginación en service**: La lógica de paginación vive en el service, no en el controller ni en el repository.
- **Contratos consistentes**: Todos los endpoints responden con el mismo formato de respuesta (data, error, paginación).
