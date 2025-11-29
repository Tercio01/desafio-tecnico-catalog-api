import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';

const router = Router();

// Rotas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rotas protegidas por autenticação
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
