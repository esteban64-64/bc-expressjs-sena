# Ejercicio 01 — Hello Node + TypeScript

## 🎯 Objetivo
Crear un script Node.js con TypeScript que lea un archivo JSON y muestre los datos formateados en consola.

## 📁 Estructura
```
ejercicio-01-hello-node/
├── data/
│   └── usuarios.json
└── src/
    └── index.ts
```

## 🚀 Cómo ejecutar
```bash
pnpm ex01
```

## ✅ Resultado esperado
```
📋 Lista de Usuarios
========================================
ID: 1 | Nombre: Alice      | Rol: admin       | ✅ Activo
ID: 2 | Nombre: Bob        | Rol: user        | ❌ Inactivo
ID: 3 | Nombre: Charlie    | Rol: user        | ✅ Activo
ID: 4 | Nombre: Diana      | Rol: moderator   | ✅ Activo
========================================
Total: 4 usuarios | Activos: 3 | Inactivos: 1
```

## 🧠 Conceptos aplicados
- Módulos ES (`import`/`export`)
- API de filesystem con promesas (`fs/promises`)
- Tipado con interfaces en TypeScript
- Manejo de errores con `try/catch`
- `async/await` para operaciones asíncronas
