export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletRow {
  id: string;
  user_id: string;
  balance: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateWalletInput {
  id: string;
  userId: string;
}
