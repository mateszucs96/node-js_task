import express from 'express';
// eslint-disable-next-line object-curly-newline
import { createProduct, findProduct, getAllProducts, updateProcutById } from '../controllers/product.controller';
import { validateBody } from '../middlewares/validate';
import { productInputSchema } from '../test/helpers/schemas';

const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', findProduct);
productRouter.post('/', validateBody(productInputSchema), createProduct);
productRouter.put('/:id', validateBody(productInputSchema), updateProcutById);

export default productRouter;
