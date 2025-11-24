"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
console.log('✅ ProductController carregado');
const getProducts = async (req, res) => {
    try {
        console.log('📝 GET /api/products chamado');
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = { active: true };
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.minPrice) {
            filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
        }
        if (req.query.maxPrice) {
            filter.price = { ...filter.price, ...(filter.price ? filter.price : {}), $lte: parseFloat(req.query.maxPrice) };
        }
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        const sort = {};
        if (req.query.sortBy) {
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
            sort[req.query.sortBy] = sortOrder;
        }
        else {
            sort.createdAt = -1;
        }
        console.log('🔍 Buscando produtos no MongoDB...');
        const products = await Product_1.default.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);
        const total = await Product_1.default.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        console.log(`✅ ${products.length} produtos encontrados`);
        res.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    }
    catch (error) {
        console.error('❌ Erro em getProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produtos',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        console.log(`📝 GET /api/products/${req.params.id} chamado`);
        const product = await Product_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error('❌ Erro em getProductById:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produto',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        console.log('📝 POST /api/products chamado', req.body);
        const product = new Product_1.default(req.body);
        const savedProduct = await product.save();
        console.log('✅ Produto criado:', savedProduct._id);
        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            data: savedProduct
        });
    }
    catch (error) {
        console.error('❌ Erro em createProduct:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Dados de produto inválidos',
                error: error.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Erro ao criar produto',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        console.log(`📝 PUT /api/products/${req.params.id} chamado`);
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.error('❌ Erro em updateProduct:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar produto',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        console.log(`📝 DELETE /api/products/${req.params.id} chamado`);
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Produto deletado com sucesso'
        });
    }
    catch (error) {
        console.error('❌ Erro em deleteProduct:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar produto',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map