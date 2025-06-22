import { ProductEntity } from '../entities/product.entity';
import * as productRepo from '../repositories/product.repository';

export const getProducts = async () => productRepo.getAllProducts();

// eslint-disable-next-line max-len
export const makeProduct = async (product: ProductEntity) => productRepo.createProduct(product);

export const findProductById = async (id: string) => productRepo.findProductById(id);

// eslint-disable-next-line max-len
export const updateProduct = async (id: string, product: ProductEntity) => productRepo.updateProduct(id, product);

export const deleteProduct = async (id: string) => productRepo.deleteProduct(id);
