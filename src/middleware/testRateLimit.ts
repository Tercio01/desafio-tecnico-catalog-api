import { Request, Response, NextFunction } from 'express';

interface ClientRequestCount {
  count: number;
  resetTime: number;
}

const clients: { [key: string]: ClientRequestCount } = {};
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 50;

/**
 * Simple rate limiter middleware for testing
 * This is a basic implementation to verify rate limiting works
 */
export function simpleRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip || 'unknown';
  const now = Date.now();

  // Initialize or reset client data
  if (!clients[ip] || now > clients[ip].resetTime) {
    clients[ip] = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  // Increment request count
  clients[ip].count++;

  // Set rate limit headers
  const remaining = Math.max(0, MAX_REQUESTS - clients[ip].count);
  const resetTime = new Date(clients[ip].resetTime).toISOString();

  res.setHeader('RateLimit-Limit', MAX_REQUESTS.toString());
  res.setHeader('RateLimit-Remaining', remaining.toString());
  res.setHeader('RateLimit-Reset', resetTime);

  console.log(`[RateLimit] IP: ${ip}, Count: ${clients[ip].count}/${MAX_REQUESTS}, Remaining: ${remaining}`);

  // Check if exceeded
  if (clients[ip].count > MAX_REQUESTS) {
    return res.status(429).json({
      status: 429,
      message: 'Too many requests, please try again later.',
      retryAfter: resetTime,
    });
  }

  next();
}
