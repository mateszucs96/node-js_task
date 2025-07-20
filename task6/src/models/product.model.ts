import mongoose from 'mongoose';
import { ProductEntity } from '../entities/product.entity';

// 1. Define Mongoose schema
const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // UUID
    title: String,
    description: String,
    price: Number,
  },
  {
    toJSON: {
      versionKey: false,
      transform(_, ret) {
        if ('_id' in ret) {
          // eslint-disable-next-line no-underscore-dangle, no-param-reassign
          delete (ret as { _id?: unknown })._id;
        }
      },
    },
    collection: 'products',
  },
);

export const Product = mongoose.model('Product', productSchema);
