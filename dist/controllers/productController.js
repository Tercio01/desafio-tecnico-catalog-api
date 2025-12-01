"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const logger_1 = __importDefault(require("../utils/logger"));
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const category = req.query.category;
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
        const filter = {};
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
            if (minPrice !== undefined)
                filter.price.$gte = minPrice;
            if (maxPrice !== undefined)
                filter.price.$lte = maxPrice;
        }
        const skip = (page - 1) * limit;
        const total = await Product_1.default.countDocuments(filter);
        const products = await Product_1.default.find(filter).skip(skip).limit(limit);
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
    }
    catch (error) {
        logger_1.default.error('Erro ao listar produtos', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar produtos',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).json({
                success: false,
                message: 'ID inválido. Deve ser um ObjectId válido do MongoDB',
            });
            return;
        }
        const product = await Product_1.default.findById(id);
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
    }
    catch (error) {
        logger_1.default.error('Erro ao buscar produto', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar produto',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, sku, stock } = req.body;
        const product = new Product_1.default({
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
    }
    catch (error) {
        logger_1.default.error('Erro ao criar produto', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar produto',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).json({
                success: false,
                message: 'ID inválido. Deve ser um ObjectId válido do MongoDB',
            });
            return;
        }
        const product = await Product_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
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
    }
    catch (error) {
        logger_1.default.error('Erro ao atualizar produto', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar produto',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).json({
                success: false,
                message: 'ID inválido. Deve ser um ObjectId válido do MongoDB',
            });
            return;
        }
        const product = await Product_1.default.findByIdAndDelete(id);
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
    }
    catch (error) {
        logger_1.default.error('Erro ao deletar produto', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar produto',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map