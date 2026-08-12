# Semana 1 — Procesador de Datos con Node.js (SENA Centro de Formación)

Herramienta de línea de comandos (CLI) en **Node.js + TypeScript** que lee
datos de aprendices desde un archivo JSON, calcula un resumen, permite
filtrar por categoría, y genera un reporte en disco.

**Dominio**: SENA Centro de Formación
**Recurso implementado**: Apprentice (`nombre_completo`, `documento`, `ficha`, `estado`, `promedio_acumulado`, `costo_matricula`)

## Estructura

```
src/
├── tipos.ts        # Interfaces: Apprentice, ResumenAprendices, Reporte
├── lector.ts        # Lee datos/centro_formacion.json con fs/promises
├── procesador.ts     # Filtra por categoría y calcula el resumen
├── escritor.ts        # Escribe salida/reporte.json
└── principal.ts       # Orquesta todo el flujo (punto de entrada)
datos/centro_formacion.json # 12 aprendices de ejemplo
```

## Instalación y ejecución

Requiere Node.js 22+ y pnpm.

```bash
pnpm install
pnpm build           # compila sin errores TypeScript (tsc --noEmit)
pnpm dev             # muestra el resumen de todas los aprendices
pnpm dev -- --category activo   # filtra solo la categoría "activo"
```

El reporte generado queda en `salida/reporte.json`.

## Manejo de errores

- Si `datos/centro_formacion.json` no existe o no se puede leer, se muestra un
error descriptivo y el proceso termina con `process.exit(1)`.
- Si se filtra por una categoría que no existe, se muestra un error listando
las categorías disponibles (`activo`, `retirado`, `graduado`).
