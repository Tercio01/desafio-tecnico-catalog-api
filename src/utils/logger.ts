import winston from 'winston';
import path from 'path';

// Níveis de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Formato com JSON estruturado
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Transports
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  new winston.transports.File({
    filename: path.join('logs', 'all.log'),
  }),
];

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  levels,
  format,
  transports,
});

// Wrapper com contexto
class Logger {
  private context: any = {};

  setContext(ctx: any) {
    this.context = ctx;
  }

  clearContext() {
    this.context = {};
  }

  private logWithContext(level: string, message: string, meta?: any) {
    winstonLogger.log(level, message, { ...this.context, ...meta });
  }

  error(message: string, meta?: any) {
    this.logWithContext('error', message, meta);
  }

  warn(message: string, meta?: any) {
    this.logWithContext('warn', message, meta);
  }

  info(message: string, meta?: any) {
    this.logWithContext('info', message, meta);
  }

  http(message: string, meta?: any) {
    this.logWithContext('http', message, meta);
  }

  debug(message: string, meta?: any) {
    this.logWithContext('debug', message, meta);
  }
}

export const logger = new Logger();
export default winstonLogger;
