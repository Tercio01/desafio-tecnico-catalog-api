import { Router, Request, Response } from 'express';
import { getMetrics, resetMetrics } from '../utils/databaseMonitoring';
import { protect, authorize } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/metrics/database:
 *   get:
 *     summary: Get database metrics
 *     description: Retrieve database performance metrics (admin only)
 *     tags:
 *       - Metrics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Database metrics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/database', protect, authorize('admin'), (req: Request, res: Response) => {
  const metrics = getMetrics();
  res.json({
    success: true,
    data: metrics
  });
});

/**
 * @swagger
 * /api/metrics/database/reset:
 *   post:
 *     summary: Reset database metrics
 *     description: Reset all collected metrics (admin only)
 *     tags:
 *       - Metrics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics reset
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/database/reset', protect, authorize('admin'), (req: Request, res: Response) => {
  resetMetrics();
  res.json({
    success: true,
    message: 'Metrics reset'
  });
});

export default router;
