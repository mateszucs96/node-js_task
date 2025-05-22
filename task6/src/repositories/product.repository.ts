import { PRODUCTS } from '../data/products';
import { ProductEntity } from '../entities/product.entity';

export const getAllProducts = () => PRODUCTS;

export const createProduct = (product: ProductEntity) => {
  PRODUCTS.push({ ...product });

  return product;
};
