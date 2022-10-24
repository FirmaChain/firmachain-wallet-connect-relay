import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';

import StoreService from '../services/store.service';
import WalletController from '../controllers/wallet.controller';

import { walletAuthMiddleware } from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';

import { WalletAuthDto, RequestDto, ApproveDto, VerifyDto } from '../dtos/wallet.dto';

class WalletRoute implements Routes {
  constructor(
    public storeService: StoreService,
    public path = '/wallets',
    public router = Router(),
    private walletController = new WalletController(storeService)
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/auth`,
      validationMiddleware(WalletAuthDto, 'body'),
      this.walletController.getUserkey
    );

    this.router.get(
      `${this.path}/dapp/:requestKey`,
      walletAuthMiddleware(),
      validationMiddleware(RequestDto, 'params'),
      this.walletController.getDappQRData
    );

    this.router.get(
      `${this.path}/sign/:requestKey`,
      walletAuthMiddleware(),
      validationMiddleware(RequestDto, 'params'),
      this.walletController.getRequestData
    );

    this.router.put(
      `${this.path}/sign/:requestKey`,
      walletAuthMiddleware(),
      validationMiddleware(RequestDto, 'params'),
      validationMiddleware(VerifyDto, 'body'),
      this.walletController.verifySign
    );

    this.router.put(
      `${this.path}/sign/:requestKey/approve`,
      walletAuthMiddleware(),
      validationMiddleware(RequestDto, 'params'),
      validationMiddleware(ApproveDto, 'body'),
      this.walletController.approveSign
    );

    this.router.put(
      `${this.path}/sign/:requestKey/reject`,
      walletAuthMiddleware(),
      validationMiddleware(RequestDto, 'params'),
      this.walletController.rejectSign
    );
  }
}

export default WalletRoute;
