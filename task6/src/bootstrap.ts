import express from 'express';
import bodyParser from 'body-parser';
import { Socket } from 'net';
import { Server } from 'http';
import { requestLogger } from './middlewares/request-logger';

export const app = express();

app.use(bodyParser.json());
app.use(requestLogger);

/**
 * TODO: Module 10 - Production-Ready Node.js Applications
 * Gracefully shuts down the server by closing all active connections and the server itself.
 * @param {Server} server - The HTTP server instance.
 * @param {Socket[]} connections - List of active connections to be closed.
 * @param {string} signal - The signal received that initiated the shutdown.
 */
export const shutdown = (server: Server, connections: Socket[], signal: string) => {};

const PORT = 8000;

/**
 * Initializes and starts the HTTP server, and sets up handling for system signals
 * for graceful shutdown.
 * @returns {Server} The HTTP server instance.
 */
export const bootstrap = () => {
  const server = app.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}`);
  });

  // TODO: Module 10 - Production-Ready Node.js Applications
  // Track new connections to the server
  // const connections: Socket[] = [];

  // Handle termination signals.
  // process.on('SIGTERM', () => shutdown(server, connections, 'SIGTERM'));
  // process.on('SIGINT', () => shutdown(server, connections, 'SIGINT'));

  return server;
};
