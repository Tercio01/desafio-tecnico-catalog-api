"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
console.log('[DEBUG-AUTH] Router criado');
router.post('/register', (req, res) => {
    console.log('[DEBUG-AUTH] POST /register chamado!');
    res.json({ success: true, message: 'Rota funcionando!' });
});
router.post('/login', (req, res) => {
    res.json({ success: true, message: 'Login funcionando!' });
});
router.get('/me', (req, res) => {
    res.json({ success: true, message: 'Get ME funcionando!' });
});
console.log('[DEBUG-AUTH] Rotas registradas');
exports.default = router;
//# sourceMappingURL=authRoutes.js.map