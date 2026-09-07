import app from "./aplicacion.js";
import { logger } from "./config/logger.js";
import { prisma } from "./lib/prisma.js";

const PUERTO = process.env.PORT || 3000;

const servidor = app.listen(PUERTO, () => {
  logger.info(`🚀 Servidor SENA Centro de Formación corriendo en http://localhost:${PUERTO}`);
  logger.info("📚 Rutas disponibles:");
  logger.info(`   GET    http://localhost:${PUERTO}/api/v1/apprentices?page=1&limit=5`);
  logger.info(`   GET    http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  logger.info(`   POST   http://localhost:${PUERTO}/api/v1/apprentices`);
  logger.info(`   PUT    http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  logger.info(`   DELETE http://localhost:${PUERTO}/api/v1/apprentices/:id`);
  logger.info(`   GET    http://localhost:${PUERTO}/health`);
});

function cerrar(señal: string): void {
  logger.info(`⚠️ ${señal} recibido. Cerrando servidor...`);
  servidor.close(async () => {
    await prisma.$disconnect();
    logger.info("✅ Servidor cerrado");
    process.exit(0);
  });
}

process.on("SIGTERM", () => cerrar("SIGTERM"));
process.on("SIGINT", () => cerrar("SIGINT"));
