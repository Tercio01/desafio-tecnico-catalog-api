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

console.log('[DEBUG-PRODUCTS] Router criado');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

console.log('[DEBUG-PRODUCTS] Rotas registradas');

export default router;
