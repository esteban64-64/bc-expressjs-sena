# Procesador de Datos — SENA Centro de Formación

Entrega de semana 01 para `bc-expressjs`.

## Dominio asignado

**SENA — Centro de Formación** — recurso `Apprentice` (`nombre_completo`, `documento`, `ficha`, `estado`, `promedio_acumulado`, `costo_matricula`).

## Cómo correr

```bash
pnpm install
pnpm dev                  # resumen completo
pnpm dev -- --category activo   # filtrar por estado
pnpm build                # verifica TypeScript estricto
```

Genera `output/report.json` con el resumen del catálogo.
