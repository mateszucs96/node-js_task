/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import http, { IncomingMessage, ServerResponse } from 'http';
import { createUser, deleteUser, getHobbiesForUser, getUsers } from '../services/user-service';
import { getUsersResponseSchema, userInputSchema, userSchema } from '../test/helpers';
import { USERS_API_URL } from '../test/constants';
import { HobbiesResponse, UserResponse, UsersResponse } from '../types/user';
import { parseRequestBody } from '../utils/parseRequestBody';
import { buildUserResponse } from '../utils/buildUserResponse';
import { sendError, sendJSON } from '../utils/sendJson';

export const handleCreateUser = async (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
  try {
    const result = await parseRequestBody(req);
    const { error, value } = userInputSchema.validate(result);
    if (error) {
      return sendError(res, 400, error.message);
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
    return sendJSON<UserResponse>(res, 200, response);
  } catch (err) {
    return sendError(res, 400, (err as Error).message);
  }
};

export const handleGetUsers = (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
  const response: UsersResponse = {
    data: getUsers().map(buildUserResponse),
    error: null,
  };

  const { error } = getUsersResponseSchema.validate(response);

  if (error) {
    return sendError(res, 500, 'Internal response validation failed');
  }
  return sendJSON<UsersResponse>(res, 200, response);
};

export const handleDeleteUser = (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>, idParam: string) => {
  const deleted = deleteUser(idParam);

  if (!deleted) {
    return sendJSON(res, 404, {
      data: null,
      error: `User with id ${idParam} doesn't exist`,
    });
  }

  const response = {
    data: { success: true },
    error: null,
  };
  return sendJSON(res, 200, response);
};

export const handleGetHobbies = (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>, idParam: string) => {
  const hobbies = getHobbiesForUser(idParam);

  if (hobbies === null) {
    return sendJSON(res, 404, {
      data: null,
      error: `User with id ${idParam} doesn't exist`,
    });
  }

  const response = {
    data: {
      hobbies,
      links: {
        self: `${USERS_API_URL}/${idParam}/hobbies`,
        user: `${USERS_API_URL}/${idParam}`,
      },
    },
    error: null,
  };

  return sendJSON<{ data: HobbiesResponse; error: null }>(res, 200, response);
};
