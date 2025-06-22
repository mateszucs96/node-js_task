import express from 'express';
import { createProduct, findProduct, getAllProducts } from '../controllers/product.controller';
import { validateBody } from '../middlewares/validate';
import { productInputSchema } from '../test/helpers/schemas';

const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', findProduct);
productRouter.post('/', validateBody(productInputSchema), createProduct);

export default productRouter;
