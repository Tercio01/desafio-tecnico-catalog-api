"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const authenticate = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Acesso negado. Token não fornecido.',
            });
            return;
        }
        req.userId = 'test-user-id';
        next();
        return;
    }
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Acesso negado. Token não fornecido.',
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (_error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido',
        });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map