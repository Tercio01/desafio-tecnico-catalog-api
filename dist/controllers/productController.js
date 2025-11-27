"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const mongoose_1 = __importDefault(require("mongoose"));
console.log('✅ ProductController carregado');
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, sku, stock } = req.body;
        const product = new Product_1.default({
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
    }
    catch (error) {
        console.error('❌ Erro em createProduct:', error.message);
        res.status(400).json({
            success: false,
            message: 'Dados de produto inválidos',
            error: error.message
        });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product_1.default.find(filter)
            .skip(skip)
            .limit(Number(limit));
        const total = await Product_1.default.countDocuments(filter);
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
    }
    catch (error) {
        console.error('❌ Erro em getProducts:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produtos',
            error: error.message
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        console.log(`📝 GET /api/products/${req.params.id} chamado`);
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
            return;
        }
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
        console.error('❌ Erro em getProductById:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produto',
            error: error.message
        });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
            return;
        }
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
        console.error('❌ Erro em updateProduct:', error.message);
        res.status(400).json({
            success: false,
            message: 'Erro ao atualizar produto',
            error: error.message
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
            return;
        }
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error('❌ Erro em deleteProduct:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar produto',
            error: error.message
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map