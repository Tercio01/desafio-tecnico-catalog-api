import CircuitBreaker from 'opossum';
import { logger } from './logger';

const options = {
  timeout: 10000, // 10 segundos
  errorThresholdPercentage: 50, // 50% de erros = abrir
  resetTimeout: 30000, // 30 segundos para tentar reconectar
  name: 'database',
  rollingCountTimeout: 10000,
};

export function createCircuitBreaker<T>(
  fn: (...args: any[]) => Promise<T>,
  name: string = 'operation'
) {
  const breaker = new CircuitBreaker(fn, {
    ...options,
    name,
  });

  breaker.fallback(() => {
    logger.warn(`Circuit breaker fallback triggered for: ${name}`);
    throw new Error(`Service ${name} is unavailable`);
  });

  breaker.on('open', () => {
    logger.error(`⚠️ Circuit breaker OPENED for: ${name}`);
  });

  breaker.on('halfOpen', () => {
    logger.warn(`⚡ Circuit breaker HALF-OPEN for: ${name} (attempting recovery)`);
  });

  breaker.on('close', () => {
    logger.info(`✅ Circuit breaker CLOSED for: ${name} (recovered)`);
  });

  return breaker;
}

export default createCircuitBreaker;
