import { z } from "zod";

export const fundWalletSchema = z.object({
  walletId: z.string().uuid(),
  amount: z.number().positive(),
});

export const withdrawFundsSchema = z.object({
  walletId: z.string().uuid(),
  amount: z.number().positive(),
});

export const transferFundsSchema = z.object({
  senderWalletId: z.string().uuid(),

  receiverWalletId: z.string().uuid(),

  amount: z.number().positive(),
});
