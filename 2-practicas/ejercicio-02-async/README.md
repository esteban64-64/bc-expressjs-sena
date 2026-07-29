# Ejercicio 02 — Comparar Patrones Async

## 🎯 Objetivo
Implementar la misma tarea (leer 3 archivos JSON en secuencia) usando 3 patrones diferentes para comparar legibilidad y manejo de errores.

## 📁 Estructura
```
ejercicio-02-async/
└── src/
    ├── index.ts
    ├── file1.json
    ├── file2.json
    └── file3.json
```

## 🚀 Cómo ejecutar
```bash
pnpm ex02
```

## ✅ Resultado esperado
```
📊 Comparación de Patrones Asíncronos en Node.js
==================================================

🔴 PATRÓN 1: CALLBACKS
  → file1: usuarios
  → file2: productos
  → file3: pedidos
callbacks: 2.145ms

🟡 PATRÓN 2: PROMESAS (.then/.catch)
  → file1: usuarios
  → file2: productos
  → file3: pedidos
promesas: 1.023ms

🟢 PATRÓN 3: ASYNC/AWAIT
  → file1: usuarios
  → file2: productos
  → file3: pedidos
async-await: 0.987ms

==================================================
✅ Comparación completada

💡 Conclusión:
   • Callbacks: Código anidado, difícil de leer y mantener
   • Promesas: Mejor, pero la cadena .then puede volverse larga
   • Async/Await: Código lineal, legible, manejo de errores con try/catch
```

## 🧠 Conceptos aplicados
- Callbacks anidados (callback hell)
- Encadenamiento de Promesas
- `async/await` con `try/catch`
- `console.time()` / `console.timeEnd()` para medir rendimiento
- `node:fs` vs `node:fs/promises`
