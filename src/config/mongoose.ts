import mongoose from "mongoose";
import { logger } from "./logger.js";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI no está definida");
  await mongoose.connect(uri);
  logger.info("🍃 MongoDB conectado");
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
