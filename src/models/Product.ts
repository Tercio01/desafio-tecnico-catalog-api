import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome do produto é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'Descrição do produto é obrigatória'],
      maxlength: [500, 'Descrição não pode ter mais de 500 caracteres'],
    },
    price: {
      type: Number,
      required: [true, 'Preço do produto é obrigatório'],
      min: [0, 'Preço não pode ser negativo'],
    },
    category: {
      type: String,
      required: [true, 'Categoria do produto é obrigatória'],
      enum: ['eletrônicos', 'roupas', 'casa', 'livros', 'esportes', 'outros'],
      lowercase: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU do produto é obrigatório'],
      unique: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: [true, 'Estoque do produto é obrigatório'],
      min: [0, 'Estoque não pode ser negativo'],
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Cria createdAt e updatedAt automaticamente
  }
);

// Índices para melhor performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ active: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);
