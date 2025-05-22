import * as productRepo from '../repositories/product.repository';

export const getProducts = () => productRepo.getAllProducts();
