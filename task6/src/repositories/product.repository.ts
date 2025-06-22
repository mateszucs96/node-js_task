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

export const updateProduct = (id: string, productForUpdate: ProductEntity) => {
  const productIdx = PRODUCTS.findIndex((el) => el.id === id);
  if (productIdx === -1) return null;

  const updatedProduct = {
    ...PRODUCTS[productIdx],
    ...productForUpdate,
  };

  PRODUCTS[productIdx] = updatedProduct;

  return updatedProduct;
};

export const deleteProduct = (id: string) => {
  const index = PRODUCTS.findIndex((product) => product.id === id);
  if (index === -1) return false;

  PRODUCTS.splice(index, 1);
  return true;
};
