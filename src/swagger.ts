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
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Total number of items'
            },
            page: {
              type: 'integer',
              description: 'Current page number'
            },
            limit: {
              type: 'integer',
              description: 'Items per page'
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages'
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Whether there is a next page'
            },
            hasPreviousPage: {
              type: 'boolean',
              description: 'Whether there is a previous page'
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
      },
      parameters: {
        pageParam: {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1
          },
          description: 'Page number for pagination'
        },
        limitParam: {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            default: 10,
            minimum: 1,
            maximum: 100
          },
          description: 'Number of items per page'
        },
        categoryParam: {
          name: 'category',
          in: 'query',
          schema: {
            type: 'string'
          },
          description: 'Filter by product category'
        },
        minPriceParam: {
          name: 'minPrice',
          in: 'query',
          schema: {
            type: 'number'
          },
          description: 'Minimum price filter'
        },
        maxPriceParam: {
          name: 'maxPrice',
          in: 'query',
          schema: {
            type: 'number'
          },
          description: 'Maximum price filter'
        },
        searchParam: {
          name: 'search',
          in: 'query',
          schema: {
            type: 'string'
          },
          description: 'Search in product name and description'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/index.ts']
};

const specs = swaggerJsdoc(options);

export default specs;
