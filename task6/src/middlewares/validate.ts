import { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line max-len, consistent-return
export const validateBody = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  req.body = value;
  next();
};
