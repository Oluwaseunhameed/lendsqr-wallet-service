import { db } from "../../config/knex";

import { DatabaseTransaction } from "../../shared/types/database-transaction";

import {
  CreateTransactionInput,
  Transaction,
  TransactionRow,
} from "./transaction.types";

import { TransactionMapper } from "./transaction.mapper";

export class TransactionRepository {
  async create(
    payload: CreateTransactionInput,
    trx?: DatabaseTransaction,
  ): Promise<void> {
    const dbOrTx = trx ?? db;

    await dbOrTx("transactions").insert({
      id: payload.id,
      wallet_id: payload.walletId,
      reference: payload.reference,
      transfer_reference: payload.transferReference ?? null,
      type: payload.type,
      amount: payload.amount,
      balance_before: payload.balanceBefore,
      balance_after: payload.balanceAfter,
      metadata: payload.metadata ?? null,
    });
  }

  async findByWalletId(
    walletId: string,
    trx?: DatabaseTransaction,
  ): Promise<Transaction[]> {
    const dbOrTx = trx ?? db;

    const rows = await dbOrTx<TransactionRow>("transactions")
      .where({
        wallet_id: walletId,
      })
      .orderBy("created_at", "desc");

    return rows.map(TransactionMapper.toDomain);
  }
}
