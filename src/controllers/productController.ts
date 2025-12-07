import { Request, Response } from 'express';
import Product from '../models/Product';

// Criar produto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'SKU já existe'
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
    
    // Paginação
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;
    
    // Total de documentos
    const total = await Product.countDocuments(query);
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalPages = Math.ceil(total / limitNum);
    
    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1
      },
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Buscar produto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Atualizar produto
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Deletar produto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
