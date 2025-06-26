/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
import http, { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { USERS_API_HOST, USERS_API_URL } from './test/constants';
import { User, UserResponse } from './types/user';
import { users } from './data/users';
import { userInputSchema, userSchema } from './test/helpers';
import { routeRequest } from './routes/user-routes';

const PORT = process.env.PORT || 8000;
const USERS: User[] = [...users];

const server = http.createServer(async (req, res) => {
  routeRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, hello wrodls`);
  console.log(USERS);
});
