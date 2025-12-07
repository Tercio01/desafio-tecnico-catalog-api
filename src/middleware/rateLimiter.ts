import rateLimit from 'express-rate-limit';

// Create shared stores for different rate limiters
const createLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 429,
        message: message,
        retryAfter: new Date(Date.now() + windowMs).toISOString(),
      });
    },
  });
};

/**
 * Global rate limiter - 100 requests per 15 minutes per IP
 */
export const globalLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again later.'
);

/**
 * Auth rate limiter - 5 requests per 15 minutes per IP
 * (counts only failed attempts)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
      retryAfter: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  },
});

/**
 * API rate limiter - 50 requests per 15 minutes per IP
 */
export const apiLimiter = createLimiter(
  15 * 60 * 1000,
  50,
  'Too many API requests from this IP, please try again later.'
);

/**
 * Write operations limiter - 20 requests per 15 minutes per IP
 */
export const createProductLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: (req) => req.method === 'GET',
  message: 'Too many write requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: 'Too many write requests. Please try again later.',
      retryAfter: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  },
});

/**
 * User-specific rate limiter
 */
export const userSpecificLimiter = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100
) => {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: (req) => {
      return (req as any).user?.id || req.ip || 'unknown';
    },
    message: 'Rate limit exceeded for your account.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 429,
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: new Date(Date.now() + windowMs).toISOString(),
      });
    },
  });
};

/**
 * Initialize rate limiting
 */
export async function initializeRateLimitStore(): Promise<void> {
  console.log('⚡️ Rate limiting initialized (built-in memory store)');
}

/**
 * Close rate limit store
 */
export async function closeRateLimitStore(): Promise<void> {
  console.log('✅ Rate limit store closed');
}

/**
 * Check Redis connection status
 */
export function isRateLimitRedisConnected(): boolean {
  return false;
}
