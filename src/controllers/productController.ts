import { Request, Response } from 'express';
import Product from '../models/Product';
import logger from '../utils/logger';

// List all products com filtros
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

    interface ProductFilter {
      $or?: Array<{ name: { $regex: string; $options: string } } | { description: { $regex: string; $options: string } }>;
      category?: string;
      price?: { $gte?: number; $lte?: number };
    }

    const filter: ProductFilter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).skip(skip).limit(limit);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Erro ao listar produtos', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar produtos',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validar se é um ObjectId válido do MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido. Deve ser um ObjectId válido do MongoDB',
      });
      return;
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error('Erro ao buscar produto', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Create product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, sku, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      sku,
      stock,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product,
    });
  } catch (error) {
    logger.error('Erro ao criar produto', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar produto',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validar se é um ObjectId válido do MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido. Deve ser um ObjectId válido do MongoDB',
      });
      return;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product,
    });
  } catch (error) {
    logger.error('Erro ao atualizar produto', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validar se é um ObjectId válido do MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido. Deve ser um ObjectId válido do MongoDB',
      });
      return;
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Produto deletado com sucesso',
      data: product,
    });
  } catch (error) {
    logger.error('Erro ao deletar produto', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar produto',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
