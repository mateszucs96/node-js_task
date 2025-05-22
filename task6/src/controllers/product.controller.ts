import { NextFunction, Request, Response } from 'express';
import { app } from '../bootstrap';
import { getProducts } from '../services/product.service';

export function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = getProducts();
    res.send(products);
  } catch (err) {
    next(err);
  }
}
