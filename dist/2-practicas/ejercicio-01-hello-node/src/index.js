import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
async function main() {
    try {
        const filePath = resolve(import.meta.dirname, "../data/usuarios.json");
        const rawData = await readFile(filePath, "utf-8");
        const usuarios = JSON.parse(rawData);
        console.log("📋 Lista de Usuarios");
        console.log("=".repeat(40));
        for (const u of usuarios) {
            const estado = u.activo ? "✅ Activo" : "❌ Inactivo";
            console.log(`ID: ${u.id} | Nombre: ${u.nombre.padEnd(10)} | Rol: ${u.rol.padEnd(10)} | ${estado}`);
        }
        const activos = usuarios.filter((u) => u.activo).length;
        console.log("=".repeat(40));
        console.log(`Total: ${usuarios.length} usuarios | Activos: ${activos} | Inactivos: ${usuarios.length - activos}`);
    }
    catch (error) {
        console.error("❌ Error al leer el archivo:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map