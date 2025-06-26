import { ProductEntity } from '../entities/product.entity';

// Please DO NOT change predefined products here. You are welcome to add new if you want.

export const products: ProductEntity[] = [
  {
    id: '51422fcd-0366-4186-ad5b-c23059b6f64f',
    title: 'Book',
    description: 'A very interesting book',
    price: 100,
  },
  {
    id: 'c28e1102-a952-4c8e-92f7-e2c34d30af95',
    title: 'Dress',
    description: 'Nice and beautiful',
    price: 300,
  },
  {
    id: '545ff714-5097-4493-b5df-84c96c187343',
    title: 'Toy',
    description: 'Teddy bear',
    price: 50,
  },
];

export const PRODUCTS: ProductEntity[] = [...products];
