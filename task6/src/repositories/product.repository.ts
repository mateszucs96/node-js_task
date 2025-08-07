import { v4 as uuidv4 } from 'uuid';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';

export const getAllProducts = async () => {
  const products = await Product.find().lean();
  return products.map(({ _id, __v, ...rest }) => rest); // remove _id and __v
};

export const createProduct = (product: ProductEntity) => Product.create(product);

export const findProductById = (productId: string) => Product.findOne({ id: productId });

export const updateProduct = (productId: string, productForUpdate: ProductEntity) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  Product.findOneAndUpdate({ id: productId }, productForUpdate, { new: true });

export const deleteProduct = (productId: string) => Product.findOneAndDelete({ id: productId });
