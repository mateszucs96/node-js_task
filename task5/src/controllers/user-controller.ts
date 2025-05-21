/* eslint-disable object-curly-newline */
/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
import http, { IncomingMessage, ServerResponse, validateHeaderName } from 'http';
import { createUser, deleteUser, getHobbiesForUser, getUsers, updateUserHobbies } from '../services/user-service';
import { getUsersResponseSchema, userInputSchema, userSchema, validateHobbies, validateUser } from '../test/helpers';
import { USERS_API_URL } from '../test/constants';
import { HobbiesResponse, UserResponse, UsersResponse } from '../types/user';
import { parseRequestBody } from '../utils/parseRequestBody';
import { buildUserResponse } from '../utils/buildUserResponse';
import { sendError, sendJSON } from '../utils/sendJson';

export const handleCreateUser = async (req: IncomingMessage, res: ServerResponse<http.IncomingMessage>) => {
  try {
    const result = (await parseRequestBody(req)) as { name: string; email: string; hobbies: string[] };

    const { error, value } = userInputSchema.validate(result);
    if (error) {
      console.log(error); // Log the full error object
      console.log(error.message); // Log just the message
      // The problem is here
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
      return sendError(res, 500, 'Internal Server Error');
    }

    return sendJSON(res, 201, { data: response, error: null });
  } catch (err) {
    // Handle unexpected errors
    return sendError(res, 400, '(err as Error).message');
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
  res.setHeader('Cache-Control', 'public, max-age=3600');
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
  res.setHeader('Cache-Control', 'private, max-age=3600');
  return sendJSON<{ data: HobbiesResponse; error: null }>(res, 200, response);
};

export const handlePatchUserHobbies = async (
  req: IncomingMessage,
  res: ServerResponse<http.IncomingMessage>,
  idParam: string,
) => {
  let body: unknown;
  try {
    body = await parseRequestBody(req);
  } catch {
    return sendError(res, 400, 'Invalid JSON');
  }

  const hobbies = (body as { hobbies: unknown })?.hobbies;
  if (!Array.isArray(hobbies) || !hobbies.every((h) => typeof h === 'string')) {
    return sendError(res, 400, 'Invalid hobbies format');
  }

  const updated = updateUserHobbies(idParam, hobbies);
  if (!updated) {
    return sendJSON(res, 404, {
      data: null,
      error: `User with id ${idParam} doesn't exist`,
    });
  }
  return sendJSON(res, 200, 'Hobbies updated successfully');
};
