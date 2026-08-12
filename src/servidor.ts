import app from "./aplicacion.js";

const PUERTO = process.env.PORT || 3000;

const servidor = app.listen(PUERTO, () => {
  console.log(`\n🚀 Servidor SENA Centro de Formación corriendo en http://localhost:${PUERTO}`);
  console.log(`📚 Rutas disponibles:`);
  console.log(`   GET    http://localhost:${PUERTO}/api/v1/apprentices`);
  console.log(`   GET    http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  console.log(`   POST   http://localhost:${PUERTO}/api/v1/apprentices`);
  console.log(`   PUT    http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  console.log(`   DELETE http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  console.log(`   GET    http://localhost:${PUERTO}/health\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n⚠️ SIGTERM recibido. Cerrando servidor...");
  servidor.close(() => {
    console.log("✅ Servidor cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n⚠️ SIGINT recibido. Cerrando servidor...");
  servidor.close(() => {
    console.log("✅ Servidor cerrado");
    process.exit(0);
  });
});
