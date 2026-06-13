import { Request, Response } from "express";

import { HTTP_STATUS } from "../../shared/constants/http-status";

import { sendSuccess } from "../../shared/responses/response-builder";

import { asyncHandler } from "../../shared/utils/async-handler";

import { WalletService } from "./wallet.service";
import { BadRequestError } from "../../shared/errors";

export class WalletController {
  constructor(private readonly walletService = new WalletService()) {}

  fundWallet = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.walletService.fundWallet(req.body);

      sendSuccess(res, HTTP_STATUS.OK, "Wallet funded successfully", result);
    },
  );

  withdrawFunds = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.walletService.withdrawFunds(req.body);

      sendSuccess(res, HTTP_STATUS.OK, "Withdrawal successful", result);
    },
  );

  transferFunds = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this.walletService.transferFunds(req.body);

      sendSuccess(res, HTTP_STATUS.OK, "Transfer successful", result);
    },
  );

  getTransactionHistory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const walletId = req.params.walletId;

      if (Array.isArray(walletId)) {
        throw new BadRequestError("Invalid wallet id");
      }

      const result = await this.walletService.getTransactionHistory(walletId);

      sendSuccess(
        res,
        HTTP_STATUS.OK,
        "Transactions retrieved successfully",
        result,
      );
    },
  );
}
