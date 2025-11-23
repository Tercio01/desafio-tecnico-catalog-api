import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Rotas públicas
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rotas protegidas (requer autenticação)
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
