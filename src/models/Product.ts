import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
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
      enum: ['eletrônicos', 'roupas', 'alimentos', 'livros', 'outros'],
      lowercase: true
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
    }
  },
  {
    timestamps: true
  }
);

// Índices para melhor performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ sku: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
