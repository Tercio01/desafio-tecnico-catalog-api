import { logger } from './logger';
import createCircuitBreaker from './circuitBreaker';

// Circuit Breaker para operações de leitura
export const readBreaker = createCircuitBreaker(
  async (fn: () => Promise<any>) => {
    return fn();
  },
  'database-read'
);

// Circuit Breaker para operações de escrita
export const writeBreaker = createCircuitBreaker(
  async (fn: () => Promise<any>) => {
    return fn();
  },
  'database-write'
);

// Helper para envolver queries
export async function executeWithCircuitBreaker<T>(
  operation: () => Promise<T>,
  type: 'read' | 'write' = 'read'
): Promise<T> {
  const breaker = type === 'read' ? readBreaker : writeBreaker;
  
  try {
    return await breaker.fire(async () => {
      return operation();
    });
  } catch (error: any) {
    logger.error(`Database ${type} operation failed`, {
      error: error.message,
      type,
    });
    throw error;
  }
}

export default { readBreaker, writeBreaker, executeWithCircuitBreaker };
