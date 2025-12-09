import { logger } from './logger';
import mongoose from 'mongoose';

interface QueryMetrics {
  collection: string;
  operation: string;
  duration: number;
  timestamp: Date;
  slow: boolean;
}

const SLOW_QUERY_THRESHOLD = 100; // ms
const metrics: QueryMetrics[] = [];

export function initDatabaseMonitoring() {
  // Hook para pré-queries
  mongoose.set('debug', (collection, method, query, doc, options) => {
    const startTime = Date.now();
    
    // Hook para pós-query
    if (method === 'findOne' || method === 'find' || method === 'updateOne' || method === 'deleteOne') {
      const duration = Date.now() - startTime;
      const isSlow = duration > SLOW_QUERY_THRESHOLD;
      
      const metric: QueryMetrics = {
        collection,
        operation: method,
        duration,
        timestamp: new Date(),
        slow: isSlow,
      };
      
      metrics.push(metric);
      
      if (isSlow) {
        logger.warn(`🐢 SLOW QUERY DETECTED`, {
          collection,
          operation: method,
          duration: `${duration}ms`,
          threshold: `${SLOW_QUERY_THRESHOLD}ms`,
          query: JSON.stringify(query),
        });
      }
    }
  });

  // Monitorar eventos de conexão
  mongoose.connection.on('connected', () => {
    logger.info('✅ MongoDB connected');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('❌ MongoDB connection error', { error: err.message });
  });

  logger.info('Database monitoring initialized');
}

export function getMetrics() {
  return {
    totalQueries: metrics.length,
    slowQueries: metrics.filter(m => m.slow).length,
    avgDuration: metrics.length > 0 
      ? Math.round(metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length)
      : 0,
    lastQueries: metrics.slice(-10),
  };
}

export function resetMetrics() {
  metrics.length = 0;
  logger.info('Database metrics reset');
}

export default { initDatabaseMonitoring, getMetrics, resetMetrics };
