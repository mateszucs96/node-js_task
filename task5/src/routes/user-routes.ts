/* eslint-disable consistent-return */
import { IncomingMessage, ServerResponse } from 'http';
import { handleCreateUser, handleDeleteUser, handleGetUsers } from '../controllers/user-controller';
import { USERS_API_URL } from '../test/constants';

export const routeRequest = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const { method } = req;
  const path = url.pathname;
  if (method === 'POST' && path === USERS_API_URL) {
    return handleCreateUser(req, res);
  }
  if (method === 'GET' && path === USERS_API_URL) {
    return handleGetUsers(req, res);
  }
  if (method === 'DELETE' && path?.startsWith(USERS_API_URL)) {
    // eslint-disable-next-line radix
    const parts = path.split('/');
    const id = parts[3];

    return handleDeleteUser(req, res, id);
  }
  res.writeHead(404);
  res.end('Not Found');
};
