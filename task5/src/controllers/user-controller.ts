/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import http, { IncomingMessage, ServerResponse } from 'http';
import { createUser, getUsers } from '../services/user-service';
import { getUsersResponseSchema, userInputSchema, userSchema } from '../test/helpers';
import { USERS_API_URL } from '../test/constants';
import { UserResponse } from '../types/user';
import { parseRequestBody } from '../utils/parseRequestBody';
import { buildUserResponse } from '../utils/buildUserResponse';

export const handleCreateUser = async (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
  try {
    const result = await parseRequestBody(req);
    const { error, value } = userInputSchema.validate(result);
    if (error) {
      console.error('Validation failed:', error.details);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: error.message }));
    }

    const newUser = createUser(value);

    const response: UserResponse = {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      links: {
        self: `${USERS_API_URL}/${newUser.id}`,
        hobbies: `${USERS_API_URL}/${newUser.id}/hobbies`,
      },
    };

    const { error: responseError } = userSchema.validate(response);
    if (responseError) {
      console.error('Invalid response shape:', responseError.details);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: (err as Error).message }));
  }
};

export const handleGetUsers = (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
  const response = {
    data: getUsers().map(buildUserResponse),
    error: null,
  };

  const { error } = getUsersResponseSchema.validate(response);

  if (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Internal response validation failed' }));
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(response));
};
