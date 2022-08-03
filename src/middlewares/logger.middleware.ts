import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(['📘[START]', req.method, req.path, JSON.stringify(req.body)].join(' '));
  next();
};

export default loggerMiddleware;
