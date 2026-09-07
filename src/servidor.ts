import "dotenv/config";
import app from "./aplicacion.js";
import { logger } from "./config/logger.js";
import { connectDB, disconnectDB } from "./config/mongoose.js";

const PUERTO = process.env.PORT || 3000;

async function main(): Promise<void> {
  await connectDB();

  const servidor = app.listen(PUERTO, () => {
    logger.info(`🚀 Servidor SENA Centro de Formación corriendo en http://localhost:${PUERTO}`);
    logger.info("📚 Rutas disponibles:");
    logger.info(`   GET    http://localhost:${PUERTO}/api/v1/programs`);
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
      await disconnectDB();
      logger.info("✅ Servidor cerrado");
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => cerrar("SIGTERM"));
  process.on("SIGINT", () => cerrar("SIGINT"));
}

main().catch((err: unknown) => {
  logger.error(`Error al iniciar el servidor: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
