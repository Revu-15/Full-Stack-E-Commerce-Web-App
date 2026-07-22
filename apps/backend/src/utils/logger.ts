/**
 * @file logger.ts
 * @description Structured application logger using Winston.
 * Outputs JSON in production (for log aggregators like Datadog / Logtail)
 * and pretty-printed colorized logs in development.
 */

import winston from 'winston';
import path from 'path';
import { config } from '../config/env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// ── Custom pretty format for development console ───────────────────────────
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `[${timestamp}] ${level}: ${message}`;
    if (stack) log += `\n${stack}`;
    if (Object.keys(meta).length > 0) log += `\n${JSON.stringify(meta, null, 2)}`;
    return log;
  })
);

// ── JSON format for production (structured logging) ────────────────────────
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// ── Transports ──────────────────────────────────────────────────────────────
const transports: winston.transport[] = [
  // Always log to console
  new winston.transports.Console({
    format: config.isProduction ? prodFormat : devFormat,
  }),
];

// In production, also persist logs to files
if (config.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: prodFormat,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: prodFormat,
    })
  );
}

export const logger = winston.createLogger({
  level: config.isDevelopment ? 'debug' : 'info',
  transports,
  // Do not exit on handled exceptions
  exitOnError: false,
});

/**
 * Stream adapter for Morgan HTTP request logging.
 * Pipes Morgan output into our Winston logger.
 */
export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};
