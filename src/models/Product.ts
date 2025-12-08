import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  active?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
    },
    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
    },
    price: {
      type: Number,
      required: [true, 'Preço é obrigatório'],
      min: [0, 'Preço não pode ser negativo']
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      enum: {
        values: ['eletrônicos', 'roupas', 'alimentos', 'livros', 'outros'],
        message: 'Categoria inválida. Use: eletrônicos, roupas, alimentos, livros ou outros'
      },
      lowercase: true,
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'SKU é obrigatório'],
      unique: true,
      uppercase: true,
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Estoque é obrigatório'],
      min: [0, 'Estoque não pode ser negativo'],
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// ===== ÍNDICES PARA PERFORMANCE E FUNCIONALIDADE =====

// Text index para busca por nome e descrição
ProductSchema.index({ name: 'text', description: 'text' });

// Performance indexes para queries comuns
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ active: 1 });

// SKU já tem unique: true, mas reforçamos
ProductSchema.index({ sku: 1 }, { unique: true });

export default mongoose.model<IProduct>('Product', ProductSchema);