# Evidencia de ejecución — Semana 01

Logs reales de `pnpm dev` (sin filtro) y `pnpm dev -- --category activo`,
capturados el 2026-09-06. Log completo en [`ejecucion.log`](./ejecucion.log).

Reporte de ejemplo generado por el segundo run (con filtro `activo`):
[`reporte-ejemplo.json`](./reporte-ejemplo.json). El reporte real se
regenera en cada ejecución en `salida/reporte.json` (ignorado por git por
ser un artefacto derivado, reproducible con `pnpm dev`).

## Run 1 — `pnpm dev`

```
🏫 RESUMEN DEL CENTRO DE FORMACIÓN SENA
==================================================
📊 Total aprendices      : 12
🟢 Activos              : 9
🔴 Retirados (inactivos): 2
🎓 Graduados            : 1

💰 Promedio matrícula   : $1.054.166,67
📈 Matrícula más alta   : $1.200.000 (Valentina Ruiz)
📉 Matrícula más baja   : $800.000 (Daniel Castro)
==================================================

📚 Resumen por programa:
  - Análisis y Desarrollo de Software (Tecnólogo): 5 aprendices, promedio acumulado 4.26
  - Gestión Empresarial (Tecnólogo): 3 aprendices, promedio acumulado 4.53
  - Mecatrónica Industrial (Tecnólogo): 2 aprendices, promedio acumulado 3.95
  - Enfermería (Técnico): 2 aprendices, promedio acumulado 3.55

✅ Reporte guardado en: salida/reporte.json
```

## Run 2 — `pnpm dev -- --category activo`

```
🏫 RESUMEN DEL CENTRO DE FORMACIÓN SENA
==================================================
📂 Filtro aplicado: estado = "activo"

📊 Total aprendices      : 9
🟢 Activos              : 9
🔴 Retirados (inactivos): 0
🎓 Graduados            : 0

💰 Promedio matrícula   : $1.077.777,78
📈 Matrícula más alta   : $1.200.000 (Valentina Ruiz)
📉 Matrícula más baja   : $800.000 (Daniel Castro)
==================================================

📚 Resumen por programa:
  - Análisis y Desarrollo de Software (Tecnólogo): 4 aprendices, promedio acumulado 4.55
  - Gestión Empresarial (Tecnólogo): 2 aprendices, promedio acumulado 4.35
  - Mecatrónica Industrial (Tecnólogo): 2 aprendices, promedio acumulado 3.95
  - Enfermería (Técnico): 1 aprendices, promedio acumulado 4.3

✅ Reporte guardado en: salida/reporte.json
```
