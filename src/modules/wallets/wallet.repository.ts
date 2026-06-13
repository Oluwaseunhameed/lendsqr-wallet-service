import { db } from "../../config/knex";
import { DatabaseTransaction } from "../../shared/types/database-transaction";

import { WalletMapper } from "./wallet.mapper";
import { CreateWalletInput, Wallet, WalletRow } from "./wallet.types";

export class WalletRepository {
  async create(
    payload: CreateWalletInput,
    trx?: DatabaseTransaction,
  ): Promise<void> {
    const dbOrTx = trx ?? db;

    await dbOrTx("wallets").insert({
      id: payload.id,
      user_id: payload.userId,
      balance: 0,
    });
  }

  async findById(
    id: string,
    trx?: DatabaseTransaction,
  ): Promise<Wallet | null> {
    const dbOrTx = trx ?? db;

    const row = await dbOrTx<WalletRow>("wallets").where({ id }).first();

    return row ? WalletMapper.toDomain(row) : null;
  }

  async findByUserId(
    userId: string,
    trx?: DatabaseTransaction,
  ): Promise<Wallet | null> {
    const dbOrTx = trx ?? db;

    const row = await dbOrTx<WalletRow>("wallets")
      .where({
        user_id: userId,
      })
      .first();

    return row ? WalletMapper.toDomain(row) : null;
  }
}
