import cors from 'cors';
import express from 'express';
import { Router } from 'express';
import Helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();

import { Routes } from './interfaces/routes.interface';

import loggerMiddleware from './middlewares/logger.middleware';
import errorMiddleware from './middlewares/error.middleware';
import morganMiddleware from './middlewares/morgan.middleware';

import { logger } from './utils/logger';
import { whitelist } from './whitelist';

import { SUCCESS } from './constants/httpResult';

class App {
  constructor(
    public routes: Routes[],
    public app = express(),
    public port = process.env.PORT || 3000,
    public env = process.env.NODE_ENV || 'development'
  ) {
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(`================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on the port ${this.port}`);
      logger.info(`================================`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }

  private checkOrigin(origin: any, callback: any): void {
    if (process.env.ORIGIN === 'true') {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('NOT ALLOWED ORIGIN'));
      }
    } else {
      callback(null, true);
    }
  }

  private initializeRoutes(routes: Routes[]): void {
    this.initializeHealthCheck();

    routes.forEach((route) => {
      this.app.use(
        '/v1',
        cors({ origin: this.checkOrigin, credentials: process.env.CREDENTIALS === 'true' }),
        route.router
      );
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(Helmet());
    this.app.use(morganMiddleware);
    this.app.use(express.json({ limit: process.env.LIMIT_FILE }));
    this.app.use(express.urlencoded({ extended: true, limit: process.env.LIMIT_FILE }));
    this.app.use(cookieParser(process.env.COOKIE));
    this.app.use((req, res, next) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
    this.app.use(loggerMiddleware);
  }

  private initializeHealthCheck(): void {
    const router = Router();
    router.get('/health', (req, res) => res.send({ ...SUCCESS, result: {} }));

    this.app.use('/', router);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}

export default App;
