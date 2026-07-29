import { readFile } from "node:fs";
import { readFile as readFilePromise } from "node:fs/promises";
import { resolve } from "node:path";
/**
 * Ejercicio 02 — Comparar Patrones Async
 * Lee 3 archivos JSON en secuencia usando:
 *   1. Callbacks (patrón clásico)
 *   2. Promesas (.then/.catch)
 *   3. async/await (patrón moderno)
 */
const file1 = resolve(import.meta.dirname, "./file1.json");
const file2 = resolve(import.meta.dirname, "./file2.json");
const file3 = resolve(import.meta.dirname, "./file3.json");
// ───────────────────────────────────────────────
// PATRÓN 1: CALLBACKS (Callback Hell / Pyramid of Doom)
// ───────────────────────────────────────────────
function leerConCallbacks() {
    console.log("\n🔴 PATRÓN 1: CALLBACKS");
    console.time("callbacks");
    readFile(file1, "utf-8", (err1, data1) => {
        if (err1) {
            console.error("Error file1:", err1.message);
            return;
        }
        const obj1 = JSON.parse(data1);
        console.log("  → file1:", obj1.modulo);
        readFile(file2, "utf-8", (err2, data2) => {
            if (err2) {
                console.error("Error file2:", err2.message);
                return;
            }
            const obj2 = JSON.parse(data2);
            console.log("  → file2:", obj2.modulo);
            readFile(file3, "utf-8", (err3, data3) => {
                if (err3) {
                    console.error("Error file3:", err3.message);
                    return;
                }
                const obj3 = JSON.parse(data3);
                console.log("  → file3:", obj3.modulo);
                console.timeEnd("callbacks");
            });
        });
    });
}
// ───────────────────────────────────────────────
// PATRÓN 2: PROMESAS (.then/.catch)
// ───────────────────────────────────────────────
function leerConPromesas() {
    console.log("\n🟡 PATRÓN 2: PROMESAS (.then/.catch)");
    console.time("promesas");
    return readFilePromise(file1, "utf-8")
        .then((data1) => {
        const obj1 = JSON.parse(data1);
        console.log("  → file1:", obj1.modulo);
        return readFilePromise(file2, "utf-8");
    })
        .then((data2) => {
        const obj2 = JSON.parse(data2);
        console.log("  → file2:", obj2.modulo);
        return readFilePromise(file3, "utf-8");
    })
        .then((data3) => {
        const obj3 = JSON.parse(data3);
        console.log("  → file3:", obj3.modulo);
        console.timeEnd("promesas");
    })
        .catch((err) => {
        console.error("Error en cadena de promesas:", err.message);
    });
}
// ───────────────────────────────────────────────
// PATRÓN 3: ASYNC/AWAIT (Patrón moderno recomendado)
// ───────────────────────────────────────────────
async function leerConAsyncAwait() {
    console.log("\n🟢 PATRÓN 3: ASYNC/AWAIT");
    console.time("async-await");
    try {
        const data1 = await readFilePromise(file1, "utf-8");
        const obj1 = JSON.parse(data1);
        console.log("  → file1:", obj1.modulo);
        const data2 = await readFilePromise(file2, "utf-8");
        const obj2 = JSON.parse(data2);
        console.log("  → file2:", obj2.modulo);
        const data3 = await readFilePromise(file3, "utf-8");
        const obj3 = JSON.parse(data3);
        console.log("  → file3:", obj3.modulo);
        console.timeEnd("async-await");
    }
    catch (err) {
        console.error("Error con async/await:", err instanceof Error ? err.message : err);
    }
}
// ───────────────────────────────────────────────
// EJECUCIÓN SECUENCIAL DE LOS 3 PATRONES
// ───────────────────────────────────────────────
async function main() {
    console.log("📊 Comparación de Patrones Asíncronos en Node.js");
    console.log("=".repeat(50));
    // Patrón 1: Callbacks (síncrono en ejecución, pero anidado)
    leerConCallbacks();
    // Esperamos un poco para no mezclar outputs
    await new Promise((r) => setTimeout(r, 100));
    // Patrón 2: Promesas
    await leerConPromesas();
    // Patrón 3: async/await
    await leerConAsyncAwait();
    console.log("\n" + "=".repeat(50));
    console.log("✅ Comparación completada");
    console.log("\n💡 Conclusión:");
    console.log("   • Callbacks: Código anidado, difícil de leer y mantener");
    console.log("   • Promesas: Mejor, pero la cadena .then puede volverse larga");
    console.log("   • Async/Await: Código lineal, legible, manejo de errores con try/catch");
}
main();
//# sourceMappingURL=index.js.map