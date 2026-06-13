import { randomUUID } from "crypto";

import { db } from "../../config/knex";

import {
  InvalidWalletOperationError,
  InsufficientBalanceError,
  NotFoundError,
} from "../../shared/errors";

import {
  FundWalletInput,
  WithdrawFundsInput,
  TransferFundsInput,
} from "./wallet.dto";

import {
  WalletBalanceResponse,
  TransferFundsResponse,
} from "./wallet.responses";

import { TRANSACTION_TYPES } from "../../shared/constants/transaction-types";

import { TransactionRepository } from "../transactions/transaction.repository";

import { WalletRepository } from "./wallet.repository";

export class WalletService {
  constructor(
    private readonly walletRepository = new WalletRepository(),

    private readonly transactionRepository = new TransactionRepository(),
  ) {}

  async fundWallet(payload: FundWalletInput): Promise<WalletBalanceResponse> {
    if (payload.amount <= 0) {
      throw new InvalidWalletOperationError("Amount must be greater than zero");
    }

    return db.transaction(async (trx) => {
      const wallet = await this.walletRepository.findByIdForUpdate(
        payload.walletId,
        trx,
      );

      if (!wallet) {
        throw new NotFoundError("Wallet not found");
      }

      const balanceBefore = wallet.balance;

      const balanceAfter = balanceBefore + payload.amount;

      await this.walletRepository.updateBalance(wallet.id, balanceAfter, trx);

      await this.transactionRepository.create(
        {
          id: randomUUID(),

          walletId: wallet.id,

          reference: randomUUID(),

          type: TRANSACTION_TYPES.FUNDING,

          amount: payload.amount,

          balanceBefore,

          balanceAfter,
        },
        trx,
      );

      return {
        walletId: wallet.id,
        balance: balanceAfter,
      };
    });
  }

  async withdrawFunds(
    payload: WithdrawFundsInput,
  ): Promise<WalletBalanceResponse> {
    if (payload.amount <= 0) {
      throw new InvalidWalletOperationError("Amount must be greater than zero");
    }

    return db.transaction(async (trx) => {
      const wallet = await this.walletRepository.findByIdForUpdate(
        payload.walletId,
        trx,
      );

      if (!wallet) {
        throw new NotFoundError("Wallet not found");
      }

      if (wallet.balance < payload.amount) {
        throw new InsufficientBalanceError();
      }

      const balanceBefore = wallet.balance;

      const balanceAfter = balanceBefore - payload.amount;

      await this.walletRepository.updateBalance(wallet.id, balanceAfter, trx);

      await this.transactionRepository.create(
        {
          id: randomUUID(),

          walletId: wallet.id,

          reference: randomUUID(),

          type: TRANSACTION_TYPES.WITHDRAWAL,

          amount: payload.amount,

          balanceBefore,

          balanceAfter,
        },
        trx,
      );

      return {
        walletId: wallet.id,
        balance: balanceAfter,
      };
    });
  }

  async transferFunds(
    payload: TransferFundsInput,
  ): Promise<TransferFundsResponse> {
    if (payload.amount <= 0) {
      throw new InvalidWalletOperationError("Amount must be greater than zero");
    }

    if (payload.senderWalletId === payload.receiverWalletId) {
      throw new InvalidWalletOperationError(
        "Cannot transfer to the same wallet",
      );
    }

    const transferReference = randomUUID();

    return db.transaction(async (trx) => {
      const walletIds = [
        payload.senderWalletId,
        payload.receiverWalletId,
      ].sort();

      const firstWallet = await this.walletRepository.findByIdForUpdate(
        walletIds[0],
        trx,
      );

      const secondWallet = await this.walletRepository.findByIdForUpdate(
        walletIds[1],
        trx,
      );

      const senderWallet =
        firstWallet?.id === payload.senderWalletId ? firstWallet : secondWallet;

      const receiverWallet =
        firstWallet?.id === payload.receiverWalletId
          ? firstWallet
          : secondWallet;

      if (!senderWallet) {
        throw new NotFoundError("Sender wallet not found");
      }

      if (!receiverWallet) {
        throw new NotFoundError("Receiver wallet not found");
      }

      if (senderWallet.balance < payload.amount) {
        throw new InsufficientBalanceError();
      }

      const senderBefore = senderWallet.balance;

      const senderAfter = senderBefore - payload.amount;

      const receiverBefore = receiverWallet.balance;

      const receiverAfter = receiverBefore + payload.amount;

      await this.walletRepository.updateBalance(
        senderWallet.id,
        senderAfter,
        trx,
      );

      await this.walletRepository.updateBalance(
        receiverWallet.id,
        receiverAfter,
        trx,
      );

      await this.transactionRepository.create(
        {
          id: randomUUID(),

          walletId: senderWallet.id,

          reference: randomUUID(),

          transferReference,

          type: TRANSACTION_TYPES.TRANSFER_DEBIT,

          amount: payload.amount,

          balanceBefore: senderBefore,

          balanceAfter: senderAfter,
        },
        trx,
      );

      await this.transactionRepository.create(
        {
          id: randomUUID(),

          walletId: receiverWallet.id,

          reference: randomUUID(),

          transferReference,

          type: TRANSACTION_TYPES.TRANSFER_CREDIT,

          amount: payload.amount,

          balanceBefore: receiverBefore,

          balanceAfter: receiverAfter,
        },
        trx,
      );

      return {
        transferReference,
      };
    });
  }

  async getTransactionHistory(walletId: string) {
    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet) {
      throw new NotFoundError("Wallet not found");
    }

    return this.transactionRepository.findByWalletId(walletId);
  }
}
