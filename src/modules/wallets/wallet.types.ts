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

export interface FundWalletInput {
  walletId: string;
  amount: number;
}

export interface WithdrawFundsInput {
  walletId: string;
  amount: number;
}

export interface TransferFundsInput {
  senderWalletId: string;
  receiverWalletId: string;
  amount: number;
}