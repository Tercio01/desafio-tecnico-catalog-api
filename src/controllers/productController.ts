import { Request, Response } from 'express';
import Product from '../models/Product';
import { executeWithCircuitBreaker } from '../utils/databaseCircuitBreaker';
import { logger } from '../utils/logger';

// Criar produto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await executeWithCircuitBreaker(
      async () => {
        const result = await Product.create(req.body);
        return Array.isArray(result) ? result[0] : result;
      },
      'write'
    );
    
    logger.info('Product created', { productId: product._id, sku: product.sku });
    
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product
    });
  } catch (error: any) {
    logger.error('Failed to create product', { error: error.message });
    
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'SKU já existe'
      });
    } else if (error.message.includes('unavailable')) {
      res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable'
      });
    } else {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

// Listar todos os produtos com paginação
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
    
    const result = await executeWithCircuitBreaker(async () => {
      let query: any = {};
      
      if (category) {
        query.category = category;
      }
      
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      
      if (search) {
        query.$text = { $search: search as string };
      }
      
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(Number(limit), 100);
      const skip = (pageNum - 1) * limitNum;
      
      const [data, total] = await Promise.all([
        Product.find(query).skip(skip).limit(limitNum),
        Product.countDocuments(query)
      ]);
      
      return {
        data,
        total,
        page: pageNum,
        limit: limitNum
      };
    }, 'read');
    
    logger.info('Products retrieved', { count: result.data.length, total: result.total });
    
    res.status(200).json({
      success: true,
      count: result.data.length,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
        hasNextPage: result.page < Math.ceil(result.total / result.limit),
        hasPreviousPage: result.page > 1
      },
      data: result.data
    });
  } catch (error: any) {
    logger.error('Failed to retrieve products', { error: error.message });
    
    if (error.message.includes('unavailable')) {
      res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error retrieving products'
      });
    }
  }
};

// Obter produto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await executeWithCircuitBreaker(
      () => Product.findById(req.params.id),
      'read'
    );
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }
    
    logger.info('Product retrieved', { productId: product._id });
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    logger.error('Failed to retrieve product', { error: error.message });
    
    if (error.message.includes('unavailable')) {
      res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error retrieving product'
      });
    }
  }
};

// Atualizar produto
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await executeWithCircuitBreaker(
      () => Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }),
      'write'
    );
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }
    
    logger.info('Product updated', { productId: product._id });
    
    res.status(200).json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product
    });
  } catch (error: any) {
    logger.error('Failed to update product', { error: error.message });
    
    if (error.message.includes('unavailable')) {
      res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable'
      });
    } else {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

// Deletar produto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await executeWithCircuitBreaker(
      () => Product.findByIdAndDelete(req.params.id),
      'write'
    );
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }
    
    logger.info('Product deleted', { productId: product._id });
    
    res.status(200).json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error: any) {
    logger.error('Failed to delete product', { error: error.message });
    
    if (error.message.includes('unavailable')) {
      res.status(503).json({
        success: false,
        message: 'Database service temporarily unavailable'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error deleting product'
      });
    }
  }
};
