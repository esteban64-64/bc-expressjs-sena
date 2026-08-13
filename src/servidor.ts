import app from "./aplicacion.js";
import { logger } from "./config/logger.js";

const PUERTO = process.env.PORT || 3000;

const servidor = app.listen(PUERTO, () => {
  logger.info(`🚀 Servidor SENA Centro de Formación corriendo en http://localhost:${PUERTO}`);
  console.log(`📚 Rutas disponibles:`);
  console.log(`   GET    http://localhost:${PUERTO}/api/v1/apprentices?page=1&limit=5`);
  console.log(`   GET    http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  console.log(`   POST   http://localhost:${PUERTO}/api/v1/apprentices`);
  console.log(`   PUT    http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  console.log(`   DELETE http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  console.log(`   GET    http://localhost:${PUERTO}/health\n`);
});

process.on("SIGTERM", () => {
  logger.info("⚠️ SIGTERM recibido. Cerrando servidor...");
  servidor.close(() => {
    logger.info("✅ Servidor cerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("⚠️ SIGINT recibido. Cerrando servidor...");
  servidor.close(() => {
    logger.info("✅ Servidor cerrado");
    process.exit(0);
  });
});
