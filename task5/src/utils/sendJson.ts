import { ServerResponse } from 'http';

export const sendJSON = <T>(res: ServerResponse, statusCode: number, data: T): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

export const sendError = (res: ServerResponse, statusCode: number, message: string): void => {
  sendJSON<{ error: string }>(res, statusCode, { error: message });
};
