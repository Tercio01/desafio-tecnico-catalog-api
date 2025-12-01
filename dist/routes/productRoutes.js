"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
console.log('[DEBUG-PRODUCTS] Router criado');
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
router.post('/', auth_1.authenticate, productController_1.createProduct);
router.put('/:id', auth_1.authenticate, productController_1.updateProduct);
router.delete('/:id', auth_1.authenticate, productController_1.deleteProduct);
console.log('[DEBUG-PRODUCTS] Rotas registradas');
exports.default = router;
//# sourceMappingURL=productRoutes.js.map