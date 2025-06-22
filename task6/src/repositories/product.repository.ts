import { PRODUCTS } from '../data/products';
import { ProductEntity } from '../entities/product.entity';

export const getAllProducts = () => PRODUCTS;

export const createProduct = (product: ProductEntity) => {
  PRODUCTS.push(product);

  return product;
};

export const findProductById = (id: string) => {
  const product = PRODUCTS.find((el) => el.id === id);
  if (!product) return null;
  return product;
};
