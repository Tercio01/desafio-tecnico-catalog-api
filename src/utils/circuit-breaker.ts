import { logger } from './logger';

export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private failureThreshold = 5;
  private timeout = 60000;

  async call<T>(fn: () => Promise<T>, context?: string): Promise<T> {
    if (this.state === 'OPEN') {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed > this.timeout) {
        this.state = 'HALF_OPEN';
        logger.warn('⚠️ Circuit Breaker HALF_OPEN', { context });
      } else {
        const remaining = Math.ceil((this.timeout - elapsed) / 1000);
        throw new Error(`Service unavailable (retry in ${remaining}s)`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(context);
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      logger.info('✅ Circuit Breaker CLOSED - Recovered');
    }
  }

  private onFailure(context?: string) {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.error(
        `🔴 Circuit Breaker OPEN after ${this.failureCount} failures (${context})`
      );
    }
  }

  getState() {
    return this.state;
  }
}

export const dbCircuitBreaker = new CircuitBreaker();
