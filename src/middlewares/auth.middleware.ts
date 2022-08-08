import { NextFunction, RequestHandler, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { UNAUTHORIZATION } from '../constants/httpResult';

import { decryptJSONData } from '../utils/crypto';

const projectAuthMiddleware = (): RequestHandler => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      next(new HttpException(UNAUTHORIZATION.code, UNAUTHORIZATION.message));
      return;
    }

    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      const decrypted: any = decryptJSONData(token);

      req.body.projectId = decrypted.projectId;

      next();
    } catch (error) {
      next(new HttpException(UNAUTHORIZATION.code, UNAUTHORIZATION.message));
    }
  };
};

const walletAuthMiddleware = (): RequestHandler => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.headers.userkey) {
      next(new HttpException(UNAUTHORIZATION.code, UNAUTHORIZATION.message));
      return;
    }

    try {
      decryptJSONData(req.headers.userkey);
      next();
    } catch (error) {
      next(new HttpException(UNAUTHORIZATION.code, UNAUTHORIZATION.message));
    }
  };
};

export { projectAuthMiddleware, walletAuthMiddleware };
