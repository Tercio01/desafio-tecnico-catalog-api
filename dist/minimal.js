"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get('/api/minimal', (req, res) => {
    console.log('🎯 MINIMAL TS: Rota chamada!');
    res.json({ success: true, message: 'MINIMAL TS WORKS', ts: true });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor MINIMAL TypeScript na porta ${PORT}`);
    console.log('📍 Teste: curl http://localhost:3000/api/minimal');
});
//# sourceMappingURL=minimal.js.map