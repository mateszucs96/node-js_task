import express from 'express';
import mongoose, { Mongoose } from 'mongoose'
import bodyParser from 'body-parser';
import { Socket } from 'net';
import { Server } from 'http';
import { requestLogger } from './middlewares/request-logger';

import productRouter from './routes/product.routes';
import { PRODUCTS_API_URL } from './test/helpers/constants';

export const app = express();

app.use(bodyParser.json());
app.use(requestLogger);

app.use(PRODUCTS_API_URL, productRouter);

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
  const uri:string = 'mongodb://root:nodegmp@localhost:27017/mydatabase?authSource=admin';

  mongoose.connect(uri).then(async () => {
    console.log("✅ Successfully connected to MongoDB");
    
  }).catch((error: Error) => {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
  });

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server is started on port ${PORT}`);
  });

  // Add graceful shutdown logic later
  return server;
};

const test = new mongoose.Schema({
  name: String,
  age: Number 
})

const TestModel = mongoose.model('Test', test);

const addTest = async (testData: { name: string; age: number }) => {
  try {
    const test = new TestModel(testData);
    await test.save();
    console.log("Test document added:", test);
  } catch (error) {
    console.error("Error adding test document:", error);
  }
}