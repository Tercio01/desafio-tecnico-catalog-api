import { Request, Response } from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';

console.log('✅ ProductController carregado');

// ===== CREATE =====
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, sku, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      sku,
      stock
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product
    });
  } catch (error: any) {
    console.error('❌ Erro em createProduct:', error.message);
    res.status(400).json({
      success: false,
      message: 'Dados de produto inválidos',
      error: error.message
    });
  }
};

// ===== READ (Get all) =====
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('❌ Erro em getProducts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos',
      error: error.message
    });
  }
};

// ===== READ (Get by ID) =====
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(`📝 GET /api/products/${req.params.id} chamado`);
    
    // Validar se ID é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    console.error('❌ Erro em getProductById:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto',
      error: error.message
    });
  }
};

// ===== UPDATE =====
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar se ID é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product
    });
  } catch (error: any) {
    console.error('❌ Erro em updateProduct:', error.message);
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: error.message
    });
  }
};

// ===== DELETE =====
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar se ID é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Produto deletado com sucesso',
      data: product
    });
  } catch (error: any) {
    console.error('❌ Erro em deleteProduct:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar produto',
      error: error.message
    });
  }
};
