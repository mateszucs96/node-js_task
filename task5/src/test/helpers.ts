/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-extraneous-dependencies */
import { IncomingMessage } from 'http';
import Joi from 'joi';
import { USERS_API_URL } from './constants';
import { User } from '../types/user';

export const validateUser = (user: User) => ({
  user: {
    id: expect.any(String),
    name: user.name,
    email: user.email,
  },
});

export const validateHobbies = (userId: string, hobbies: string[]) => ({
  hobbies,
  links: {
    self: `${USERS_API_URL}/${userId}/hobbies`,
    user: `${USERS_API_URL}/${userId}`,
  },
});

export const userSchema = Joi.object({
  links: Joi.object({
    hobbies: Joi.string()
      .regex(/^\/api\/users\/.+\/hobbies$/)
      .required(),
    self: Joi.string()
      .regex(/^\/api\/users\/.+$/)
      .required(),
  }).required(),
  user: Joi.object({
    email: Joi.string().required(),
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
  }).required(),
});

export const userInputSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  hobbies: Joi.array().items(Joi.string()).required(),
});

export const getUsersResponseSchema = Joi.object({
  data: Joi.array().items(userSchema),
  error: Joi.allow(null),
});

export const parseRequestBody = (req: IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(JSON.parse(body));
    });

    req.on('error', (error: Error) => {
      reject(error);
    });
  });
