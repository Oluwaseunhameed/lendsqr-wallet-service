export interface Transaction {
  id: string;
  walletId: string;
  reference: string;
  transferReference: string | null;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface TransactionRow {
  id: string;
  wallet_id: string;
  reference: string;
  transfer_reference: string | null;
  type: string;
  amount: string;
  balance_before: string;
  balance_after: string;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

export interface CreateTransactionInput {
  id: string;
  walletId: string;
  reference: string;
  transferReference?: string | null;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, unknown> | null;
}
