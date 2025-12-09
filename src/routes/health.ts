import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const router = Router();

interface HealthCheck {
  status: 'UP' | 'DEGRADED' | 'DOWN';
  timestamp: string;
  checks: {
    api: 'UP' | 'DOWN';
    database: 'UP' | 'DOWN';
  };
  responseTime: number;
}

router.get('/health', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const health: HealthCheck = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    checks: {
      api: 'UP',
      database: 'DOWN'
    },
    responseTime: 0
  };

  try {
    await Promise.race([
        mongoose.connection.db?.admin().ping(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB timeout')), 5000)
      )
    ]);
    health.checks.database = 'UP';
  } catch (error) {
    health.checks.database = 'DOWN';
    health.status = 'DEGRADED';
    logger.warn('DATABASE_HEALTH_CHECK_FAILED');
  }

  health.responseTime = Date.now() - startTime;
  const statusCode = health.status === 'UP' ? 200 : 503;
  
  res.status(statusCode).json(health);
});

export default router;
