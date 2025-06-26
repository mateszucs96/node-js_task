/* eslint-disable implicit-arrow-linebreak */
import { IncomingMessage } from 'http';

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
