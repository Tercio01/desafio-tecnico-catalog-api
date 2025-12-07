import rateLimit, { RateLimitRequestHandler, Options } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient, RedisClientType } from 'redis';

// Redis client for storing rate limit data
let redisClient: RedisClientType | null = null;

/**
 * Initialize Redis client for rate limiting
 * Falls back to memory store if Redis is unavailable
 */
export async function initializeRateLimitStore(): Promise<void> {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('✅ Redis connected for rate limiting'));

    await redisClient.connect();
  } catch (error) {
    console.warn('⚠️  Redis not available, using memory store for rate limiting');
    redisClient = null;
  }
}

/**
 * Get rate limit store (Redis or memory)
 */
function getStore() {
  if (redisClient) {
    return new RedisStore({
      client: redisClient,
      prefix: 'rate-limit:',
    });
  }
  // Falls back to memory store
  return undefined;
}

/**
 * Global rate limiter - applies to all requests
 * 100 requests per 15 minutes per IP
 */
export const globalLimiter: RateLimitRequestHandler = rateLimit({
  store: getStore() as any,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Too many requests, please try again later.',
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  store: getStore() as any,
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    status: 429,
    message: 'Too many login attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * API endpoints rate limiter
 * 50 requests per 15 minutes per IP (for logged-in users)
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  store: getStore() as any,
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: 429,
    message: 'Too many API requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * Create product limiter - stricter for POST/PUT/DELETE
 * 20 requests per 15 minutes per IP
 */
export const createProductLimiter: RateLimitRequestHandler = rateLimit({
  store: getStore() as any,
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: (req) => req.method === 'GET', // Only apply to write operations
  message: {
    status: 429,
    message: 'Too many product creation requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Too many write requests. Please try again later.',
      retryAfter: req.rateLimit?.resetTime,
    });
  },
});

/**
 * User-specific rate limiter (for authenticated users)
 * Uses user ID instead of IP
 */
export const userSpecificLimiter = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100
): RateLimitRequestHandler => {
  return rateLimit({
    store: getStore() as any,
    windowMs,
    max,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise use IP
      return (req as any).user?.id || req.ip || 'unknown';
    },
    message: {
      status: 429,
      message: 'Rate limit exceeded for your account.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 429,
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: req.rateLimit?.resetTime,
      });
    },
  });
};

/**
 * Gracefully close Redis connection
 */
export async function closeRateLimitStore(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    console.log('✅ Rate limit store closed');
  }
}

/**
 * Export Redis client for direct use if needed
 */
export function getRedisClient(): RedisClientType | null {
  return redisClient;
}
