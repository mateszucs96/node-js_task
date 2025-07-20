import mongoose from 'mongoose';
import { ProductEntity } from '../entities/product.entity';

// 1. Define Mongoose schema
export const productSchema = new mongoose.Schema<ProductEntity>(
  {
    title: String,
    description: String,
    price: Number,
  },
  { collection: 'products' },
);

export const Product = mongoose.model('Product', productSchema);
