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
