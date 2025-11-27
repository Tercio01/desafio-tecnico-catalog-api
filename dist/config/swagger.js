"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Catalog API - Desafio Técnico',
        version: '1.0.0',
        description: 'API REST para gerenciamento de catálogo de produtos com autenticação JWT',
        contact: {
            name: 'Tercio Alves Parente',
            url: 'https://github.com/Tercio01',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de Desenvolvimento',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            Product: {
                type: 'object',
                required: ['name', 'description', 'price', 'category', 'sku', 'stock'],
                properties: {
                    _id: {
                        type: 'string',
                        description: 'ID único do produto',
                    },
                    name: {
                        type: 'string',
                        description: 'Nome do produto',
                        minLength: 3,
                        maxLength: 100,
                    },
                    description: {
                        type: 'string',
                        description: 'Descrição detalhada do produto',
                        minLength: 10,
                        maxLength: 500,
                    },
                    price: {
                        type: 'number',
                        description: 'Preço do produto',
                        minimum: 0,
                    },
                    category: {
                        type: 'string',
                        description: 'Categoria do produto',
                    },
                    sku: {
                        type: 'string',
                        description: 'Código SKU único do produto',
                    },
                    stock: {
                        type: 'integer',
                        description: 'Quantidade em estoque',
                        minimum: 0,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
            },
            User: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    _id: {
                        type: 'string',
                        description: 'ID único do usuário',
                    },
                    name: {
                        type: 'string',
                        description: 'Nome completo do usuário',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Email do usuário',
                    },
                    role: {
                        type: 'string',
                        enum: ['admin', 'user'],
                        description: 'Papel do usuário no sistema',
                    },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false,
                    },
                    message: {
                        type: 'string',
                    },
                    errors: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                field: {
                                    type: 'string',
                                },
                                message: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    tags: [
        {
            name: 'Auth',
            description: 'Endpoints de autenticação',
        },
        {
            name: 'Products',
            description: 'Endpoints de gerenciamento de produtos',
        },
    ],
};
const options = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts', './src/routes/*.swagger.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map