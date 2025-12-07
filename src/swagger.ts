import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Catalog API - OpenAPI 3.0',
      version: '1.0.0',
      description: 'API REST de Catálogo de Produtos com autenticação JWT e microsserviços',
      contact: {
        name: 'Tercio Alves Parente',
        email: 'tercio1parente@gmail.com',
        url: 'https://github.com/Tercio01'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      },
      {
        url: 'https://api.catalog.com',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'User password (hashed in database)'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role for access control'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'category', 'sku'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Product unique identifier'
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Product name'
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Detailed product description'
            },
            price: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Product price in USD'
            },
            category: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              description: 'Product category'
            },
            sku: {
              type: 'string',
              pattern: '^[A-Z0-9-]{5,20}$',
              description: 'Stock Keeping Unit - unique product code'
            },
            stock: {
              type: 'integer',
              minimum: 0,
              default: 0,
              description: 'Available quantity in stock'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error description'
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/index.ts']
};

const specs = swaggerJsdoc(options);

export default specs;
