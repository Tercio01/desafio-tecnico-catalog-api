import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres').max(500, 'Descrição deve ter no máximo 500 caracteres'),
  price: z.number().positive('Preço deve ser um valor positivo').max(1000000, 'Preço não pode exceder 1.000.000'),
  category: z.string().min(3, 'Categoria deve ter no mínimo 3 caracteres').max(50, 'Categoria deve ter no máximo 50 caracteres'),
  sku: z.string().min(3, 'SKU deve ter no mínimo 3 caracteres').max(50, 'SKU deve ter no máximo 50 caracteres'),
  stock: z.number().int('Estoque deve ser um número inteiro').min(0, 'Estoque não pode ser negativo'),
});

export const updateProductSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  price: z.number().positive().max(1000000).optional(),
  category: z.string().min(3).max(50).optional(),
  sku: z.string().min(3).max(50).optional(),
  stock: z.number().int().min(0).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
});

export const productQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().transform(val => parseFloat(val)).pipe(z.number().positive()).optional(),
  maxPrice: z.string().transform(val => parseFloat(val)).pipe(z.number().positive()).optional(),
  search: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive()).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).pipe(z.number().int().positive().max(100)).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
