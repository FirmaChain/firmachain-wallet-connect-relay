import { Request, Response } from 'express';

import StoreService from '../services/store.service';
import WalletService from '../services/wallet.service';

import { SignData } from '../interfaces/wallet.interface';

import { resultLog } from '../utils/logger';
import { SUCCESS, INVALID_KEY } from '../constants/httpResult';

class WalletController {
  constructor(public storeService: StoreService, private walletService = new WalletService(storeService)) {}

  public getUserkey = (req: Request, res: Response): void => {
    const { userkey } = req.body;

    this.walletService
      .getUserkey(userkey)
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch(() => {
        res.send({ ...INVALID_KEY, result: {} });
      });
  };

  public getRequestData = (req: Request, res: Response): void => {
    const { requestKey } = req.params;

    this.walletService
      .getRequestData(requestKey)
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch((err) => {
        res.send({ ...INVALID_KEY, result: {} });
      });
  };

  public verifySign = (req: Request, res: Response): void => {
    const { requestKey } = req.params;
    const { signature } = req.body;

    this.walletService
      .verifySign(requestKey, signature)
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch((err) => {
        res.send({ ...INVALID_KEY, result: {} });
      });
  };

  public approveSign = (req: Request, res: Response): void => {
    const { requestKey } = req.params;
    const { rawData, address, chainId } = req.body;

    const signData: SignData = { rawData, address, chainId };

    this.walletService
      .approveRequest(requestKey, signData)
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch(() => {
        res.send({ ...INVALID_KEY, result: {} });
      });
  };

  public rejectSign = (req: Request, res: Response): void => {
    const { requestKey } = req.params;

    this.walletService
      .rejectRequest(requestKey)
      .then((result) => {
        resultLog(result);
        res.send({ ...SUCCESS, result });
      })
      .catch(() => {
        res.send({ ...INVALID_KEY, result: {} });
      });
  };
}

export default WalletController;
