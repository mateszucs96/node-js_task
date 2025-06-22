import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { getProducts, makeProduct, findProductById } from '../services/product.service';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getProducts();
    res.status(200).send({ data: products });
  } catch (err) {
    next(err);
  }
};
// eslint-disable-next-line consistent-return
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4();
    const product = { ...req.body, id };

    const createdProduct = await makeProduct(product);
    res.status(201).send({ data: createdProduct });
  } catch (err) {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
export const findProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await findProductById(id);

    if (!product) return res.status(404).send({ error: 'Product not found' });

    return res.status(200).send({ data: product });
  } catch (err) {
    next(err);
  }
};
