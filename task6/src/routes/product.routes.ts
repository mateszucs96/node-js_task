import express from 'express';
// eslint-disable-next-line object-curly-newline
import {
  createProduct,
  deleteProductById,
  findProduct,
  getAllProducts,
  updateProductById,
} from '../controllers/product.controller';
import { validateBody } from '../middlewares/validate';
import { productInputSchema } from '../test/helpers/schemas';

const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', findProduct);
productRouter.post('/', validateBody(productInputSchema), createProduct);
productRouter.put('/:id', validateBody(productInputSchema), updateProductById);
productRouter.delete('/:id', deleteProductById);

export default productRouter;
