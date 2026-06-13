import { Transaction, TransactionRow } from "./transaction.types";

export class TransactionMapper {
  static toDomain(row: TransactionRow): Transaction {
    return {
      id: row.id,
      walletId: row.wallet_id,
      reference: row.reference,
      transferReference: row.transfer_reference,
      type: row.type,
      amount: Number(row.amount),
      balanceBefore: Number(row.balance_before),
      balanceAfter: Number(row.balance_after),
      metadata: row.metadata,
      createdAt: row.created_at,
    };
  }
}
