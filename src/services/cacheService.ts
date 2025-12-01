import { redisClient } from '../config/redis';
import logger from '../utils/logger';

export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT_BY_ID: (id: string) => `product:${id}`,
  PRODUCTS_FILTERED: (filters: string) => `products:filters:${filters}`,
};

const DEFAULT_TTL = 3600;

export const getFromCache = async (key: string) => {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      logger.info(`Cache HIT: ${key}`);
      return JSON.parse(cached);
    }
    logger.info(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    logger.error(`Error getting cache for ${key}:`, String(error));
    return null;
  }
};

export const setInCache = async (
  key: string,
  value: any,
  ttl: number = DEFAULT_TTL
) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    logger.info(`Cache SET: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    logger.error(`Error setting cache for ${key}:`, String(error));
  }
};

export const deleteFromCache = async (key: string) => {
  try {
    await redisClient.del(key);
    logger.info(`Cache DELETE: ${key}`);
  } catch (error) {
    logger.error(`Error deleting cache for ${key}:`, String(error));
  }
};

export const invalidatePattern = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cache INVALIDATE: ${keys.length} keys deleted (pattern: ${pattern})`);
    }
  } catch (error) {
    logger.error(`Error invalidating cache pattern ${pattern}:`, String(error));
  }
};

export const flushCache = async () => {
  try {
    await redisClient.flushDb();
    logger.info('Cache FLUSHED: All keys deleted');
  } catch (error) {
    logger.error('Error flushing cache:', String(error));
  }
};
