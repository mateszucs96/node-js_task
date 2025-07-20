import { PRODUCTS } from '../data/products';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/project.model';

export const getAllProducts = () => Product.find().lean();

export const createProduct = (product: ProductEntity) => Product.create(product);

export const findProductById = (productId: string) => Product.findById(productId);

export const updateProduct = (productId: string, productForUpdate: ProductEntity) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Product.findByIdAndUpdate(productId, productForUpdate, { new: true });

export const deleteProduct = (productId: string) => Product.findByIdAndDelete(productId);
