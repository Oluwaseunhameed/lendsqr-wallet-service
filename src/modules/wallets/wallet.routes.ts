import { Router } from "express";

import { validate } from "../../shared/middleware/validate";

import { WalletController } from "./wallet.controller";

import {
  fundWalletSchema,
  transferFundsSchema,
  withdrawFundsSchema,
} from "./wallet.schemas";

const router = Router();

const walletController = new WalletController();

router.post("/fund", validate(fundWalletSchema), walletController.fundWallet);

router.post(
  "/withdraw",
  validate(withdrawFundsSchema),
  walletController.withdrawFunds,
);

router.post(
  "/transfer",
  validate(transferFundsSchema),
  walletController.transferFunds,
);

router.get("/:walletId/transactions", walletController.getTransactionHistory);

export { router as walletRoutes };
