import { Wallet, WalletRow } from "./wallet.types";

export class WalletMapper {
  static toDomain(row: WalletRow): Wallet {
    return {
      id: row.id,
      userId: row.user_id,
      balance: Number(row.balance),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
