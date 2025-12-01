"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'Usuário já existe com este email',
            });
            return;
        }
        const user = new User_1.default({ name, email, password, role });
        await user.save();
        const token = generateToken(user._id.toString());
        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        logger_1.default.error('Erro ao registrar usuário', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar usuário',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Credenciais inválidas',
            });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Credenciais inválidas',
            });
            return;
        }
        const token = generateToken(user._id.toString());
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        logger_1.default.error('Erro ao fazer login', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuário não encontrado',
            });
            return;
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        logger_1.default.error('Erro ao buscar usuário', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar usuário',
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map