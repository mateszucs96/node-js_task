/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import http, { IncomingMessage, ServerResponse } from 'http';
import { createUser, getUsers } from '../services/user-service';
import { getUsersResponseSchema, userInputSchema, userSchema } from '../test/helpers';
import { USERS_API_URL } from '../test/constants';
import { User, UserResponse, UsersResponse } from '../types/user';
import { parseRequestBody } from '../utils/parseRequestBody';
import { buildUserResponse } from '../utils/buildUserResponse';
import { sendError, sendJSON } from '../utils/sendJson';

export const handleCreateUser = async (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
  try {
    const result = await parseRequestBody(req);
    const { error, value } = userInputSchema.validate(result);
    if (error) {
      sendError(res, 400, error.message);
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
      sendError(res, 500, 'Internal Server Error');
    }
    sendJSON<UserResponse>(res, 200, response);
  } catch (err) {
    sendError(res, 400, (err as Error).message);
  }
};

export const handleGetUsers = (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
  const response: UsersResponse = {
    data: getUsers().map(buildUserResponse),
    error: null,
  };

  const { error } = getUsersResponseSchema.validate(response);

  if (error) {
    sendError(res, 500, 'Internal response validation failed');
  }
  sendJSON<UsersResponse>(res, 200, response);
};
