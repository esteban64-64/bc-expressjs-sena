import winston from "winston";

/**
 * Logger Winston configurado por entorno.
 * - Desarrollo: nivel http, formato colorizado
 * - Producción: nivel warn, formato JSON, archivo logs/error.log
 */

const { combine, timestamp, json, colorize, printf } = winston.format;

const env = process.env.NODE_ENV || "development";

const desarrolloFormato = combine(
  colorize(),
  printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const produccionFormato = combine(timestamp(), json());

const transports: winston.transport[] = [
  new winston.transports.Console({
    level: env === "development" ? "http" : "warn",
    format: env === "development" ? desarrolloFormato : produccionFormato,
  }),
];

// Solo en producción: archivo de errores
if (env === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    })
  );
}

export const logger = winston.createLogger({
  level: env === "development" ? "http" : "warn",
  defaultMeta: { service: "sena-api" },
  transports,
});

// Stream para Morgan que usa Winston
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
