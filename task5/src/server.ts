/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
import http, { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { USERS_API_HOST, USERS_API_URL } from './test/constants';
import { User, UserResponse } from './types/user';
import { users } from './data/users';
import { userInputSchema, userSchema } from './test/helpers';

const PORT = process.env.PORT || 8000;
const USERS: User[] = [...users];

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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, USERS_API_HOST);
  const { method } = req;
  const path = url.pathname;

  if (method === 'POST' && path === USERS_API_URL) {
    try {
      const result = await parseRequestBody(req);
      const { error, value } = userInputSchema.validate(result);
      if (error) {
        console.error('Validation failed:', error.details);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: error.message }));
      }

      // eslint-disable-next-line max-len
      const newUser: User = {
        id: uuidv4(),
        name: value.name,
        email: value.email,
        hobbies: value.hobbies || [],
      };

      USERS.push({ ...newUser });

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
      console.log(USERS);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, hello wrodls`);
  console.log(USERS);
});
