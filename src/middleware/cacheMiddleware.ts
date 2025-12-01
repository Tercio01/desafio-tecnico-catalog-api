import { Request, Response, NextFunction } from 'express';
import { getFromCache, setInCache, CACHE_KEYS } from '../services/cacheService';
import logger from '../utils/logger';

export const cacheProductsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey =
      Object.keys(req.query).length > 0
        ? CACHE_KEYS.PRODUCTS_FILTERED(JSON.stringify(req.query))
        : CACHE_KEYS.PRODUCTS;

    const cached = await getFromCache(cacheKey);
    if (cached) {
      logger.info(`✅ Cache HIT for: ${cacheKey}`);
      return res.json(cached);
    }

    logger.info(`⚠️ Cache MISS for: ${cacheKey}`);

    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      if (res.statusCode === 200) {
        setInCache(cacheKey, data, 3600).catch((err) =>
          logger.error('Error setting cache:', String(err))
        );
      }
      return originalJson(data);
    };

    next();
  } catch (error) {
    logger.error('Error in cacheProductsMiddleware:', String(error));
    next();
  }
};

export const cacheSingleProductMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.method !== 'GET') {
      return next();
    }

    const { id } = req.params;
    const cacheKey = CACHE_KEYS.PRODUCT_BY_ID(id);

    const cached = await getFromCache(cacheKey);
    if (cached) {
      logger.info(`✅ Cache HIT for product: ${id}`);
      return res.json(cached);
    }

    logger.info(`⚠️ Cache MISS for product: ${id}`);

    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      if (res.statusCode === 200) {
        setInCache(cacheKey, data, 3600).catch((err) =>
          logger.error('Error setting cache:', String(err))
        );
      }
      return originalJson(data);
    };

    next();
  } catch (error) {
    logger.error('Error in cacheSingleProductMiddleware:', String(error));
    next();
  }
};
