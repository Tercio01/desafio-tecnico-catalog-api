// Simple logger utility - console calls are intentional for development
/* eslint-disable no-console */

const logger = {
  error: (message: string, _error?: unknown) => {
    // In development, log to console
    // In production, this would send to a logging service
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, _error);
    }
  },
  info: (message: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`);
    }
  },
};

export default logger;
