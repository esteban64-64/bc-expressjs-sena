# Proyecto Semana 01 — Procesador de Datos (SENA Centro de Formación)

## 🎯 Objetivo
Construir una herramienta de línea de comandos (CLI) que lea datos desde un archivo JSON, los procese aplicando filtros y transformaciones, y genere un reporte con los resultados — todo usando **Node.js + TypeScript + async/await**.

## 🏛️ Dominio Asignado
**SENA — Centro de Formación**

Entidades:
- **Apprentices** (Aprendices)
- **Programs** (Programas de formación)
- **Instructors** (Instructores)
- **Competencies** (Competencias)

Recurso principal procesado: `Apprentice` (Aprendiz)

## 📁 Estructura
```
starter/
├── data/
│   └── centro_formacion.json    # Datos de entrada (12 aprendices)
├── src/
│   ├── index.ts                 # Punto de entrada / procesador CLI
│   ├── types.ts                 # Interfaces del dominio SENA
│   └── utils.ts                 # Utilidades de filesystem
└── output/                      # Generado automáticamente
    └── report.json
```

## 🚀 Cómo ejecutar

```bash
# Sin filtro — muestra todos los aprendices
pnpm dev

# Con filtro por categoría (estado del aprendiz)
pnpm dev -- --category activo
pnpm dev -- --category retirado
pnpm dev -- --category graduado

# Compilar TypeScript (verifica que no hay errores)
pnpm build
```

## ✅ Requisitos Funcionales Implementados

### 1. Leer datos desde un archivo JSON
La herramienta lee `data/centro_formacion.json` usando `node:fs/promises`.

### 2. Mostrar un resumen del catálogo
- **Total de aprendices**
- **Activos vs Retirados vs Graduados**
- **Promedio de matrícula** (`costo_matricula`)
- **Aprendiz con matrícula más alta** y **más baja**

### 3. Filtrar por categoría
Acepta un argumento de línea de comandos para filtrar por estado:
```bash
pnpm dev -- --category activo
```
Si la categoría no existe, muestra error y lista las disponibles.

### 4. Generar reporte en un archivo de salida
Guarda el reporte en `output/report.json` usando `fs/promises.writeFile`.

### 5. Manejo de errores
- Si el archivo `centro_formacion.json` no existe → error descriptivo y `process.exit(1)`
- Si la categoría no existe → muestra aviso, lista categorías disponibles y `process.exit(1)`

## 🧠 Conceptos aplicados
- **ES Modules**: `import`/`export` con `"type": "module"`
- **TypeScript strict**: Interfaces, tipos literales union, `strict: true`
- **Async/Await**: Todas las operaciones de I/O son asíncronas
- **fs/promises**: API moderna de filesystem basada en promesas
- **process.argv**: Lectura de argumentos de línea de comandos
- **Manejo de errores**: `try/catch`, verificación de `ENOENT`, validación de inputs
- **Separación de responsabilidades**: tipos, utilidades y lógica de negocio separadas

## 📊 Datos del dominio

| Campo | Descripción |
|-------|-------------|
| `nombre_completo` | Nombre del aprendiz |
| `documento` | Número de documento |
| `programa_id` | ID del programa de formación |
| `ficha` | Número de ficha SENA |
| `estado` | `activo` / `retirado` / `graduado` |
| `fecha_ingreso` | Fecha de ingreso (ISO 8601) |
| `promedio_acumulado` | Nota promedio (0-5) |
| `costo_matricula` | Valor de la matrícula en COP |

**Total de registros**: 12 aprendices distribuidos en 4 programas.

## 📝 Notas
- Dominio asignado: **SENA Centro de Formación** 🏫
- El campo `costo_matricula` representa el "precio" del recurso para las estadísticas.
- La "categoría" de filtrado corresponde al `estado` del aprendiz.
