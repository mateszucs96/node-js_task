import { Request, Response, NextFunction } from 'express';

/**
 * TODO: Module 10 - Production-Ready Node.js Applications
 * Middleware function that logs details about each HTTP request.
 * It captures the start time, then logs the method, URL, and duration after the response finishes.
 *
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  next();
};
