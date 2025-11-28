import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface AppError extends Error {
  status?: number;
}

export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Erro não tratado', err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};
