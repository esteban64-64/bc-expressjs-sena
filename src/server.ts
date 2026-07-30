import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor SENA Centro de Formación corriendo en http://localhost:${PORT}`);
  console.log(`📚 Rutas disponibles:`);
  console.log(`   GET    http://localhost:${PORT}/api/v1/apprentices`);
  console.log(`   GET    http://localhost:${PORT}/api/v1/apprentices/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/v1/apprentices`);
  console.log(`   PUT    http://localhost:${PORT}/api/v1/apprentices/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/v1/apprentices/:id`);
  console.log(`   GET    http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n⚠️ SIGTERM recibido. Cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n⚠️ SIGINT recibido. Cerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor cerrado");
    process.exit(0);
  });
});
