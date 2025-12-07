import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

/**
 * Global rate limiter - applies to all requests
 * 100 requests per 15 minutes per IP
 */
export const globalLimiter: RateLimitRequestHandler = rateLimit({
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
 * 50 requests per 15 minutes per IP
 */
export const apiLimiter: RateLimitRequestHandler = rateLimit({
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
 * Dummy async function for compatibility
 * Rate limiting is now handled by express-rate-limit memory store
 */
export async function initializeRateLimitStore(): Promise<void> {
  console.log('⚡️ Rate limiting initialized (memory store)');
}

/**
 * Gracefully close rate limit store
 */
export async function closeRateLimitStore(): Promise<void> {
  console.log('✅ Rate limit store closed');
}

/**
 * Check if Redis is connected (always false now)
 */
export function isRateLimitRedisConnected(): boolean {
  return false;
}
