import { db } from "../../../config/knex";

import { WalletService } from "../wallet.service";

jest.mock("../../../config/knex", () => ({
  db: {
    transaction: jest.fn(),
  },
}));

function createMocks() {
  return {
    walletRepository: {
      findById: jest.fn(),
      findByIdForUpdate: jest.fn(),
      updateBalance: jest.fn(),
    },

    transactionRepository: {
      create: jest.fn(),
      findByWalletId: jest.fn(),
    },
  };
}

describe("WalletService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockedDb = db as unknown as {
      transaction: jest.Mock;
    };

    mockedDb.transaction.mockImplementation(
      async (callback: (trx: unknown) => Promise<unknown>) => callback({}),
    );
  });

  describe("fundWallet", () => {
    it("should fund wallet successfully", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findByIdForUpdate.mockResolvedValue({
        id: "wallet-id",
        userId: "user-id",
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      const result = await walletService.fundWallet({
        walletId: "wallet-id",
        amount: 500,
      });

      expect(mocks.walletRepository.updateBalance).toHaveBeenCalled();

      expect(mocks.transactionRepository.create).toHaveBeenCalled();

      expect(result).toEqual({
        walletId: "wallet-id",
        balance: 1500,
      });
    });

    it("should reject non-positive funding amount", async () => {
      const walletService = new WalletService({} as any, {} as any);

      await expect(
        walletService.fundWallet({
          walletId: "wallet-id",
          amount: 0,
        }),
      ).rejects.toThrow("Amount must be greater than zero");
    });

    it("should throw when wallet does not exist", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findByIdForUpdate.mockResolvedValue(null);

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      await expect(
        walletService.fundWallet({
          walletId: "wallet-id",
          amount: 500,
        }),
      ).rejects.toThrow("Wallet not found");
    });
  });

  describe("withdrawFunds", () => {
    it("should withdraw funds successfully", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findByIdForUpdate.mockResolvedValue({
        id: "wallet-id",
        userId: "user-id",
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      const result = await walletService.withdrawFunds({
        walletId: "wallet-id",
        amount: 400,
      });

      expect(result).toEqual({
        walletId: "wallet-id",
        balance: 600,
      });
    });

    it("should reject non-positive withdrawal amount", async () => {
      const walletService = new WalletService({} as any, {} as any);

      await expect(
        walletService.withdrawFunds({
          walletId: "wallet-id",
          amount: 0,
        }),
      ).rejects.toThrow("Amount must be greater than zero");
    });

    it("should throw when wallet does not exist", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findByIdForUpdate.mockResolvedValue(null);

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      await expect(
        walletService.withdrawFunds({
          walletId: "wallet-id",
          amount: 500,
        }),
      ).rejects.toThrow("Wallet not found");
    });

    it("should throw when balance is insufficient", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findByIdForUpdate.mockResolvedValue({
        id: "wallet-id",
        userId: "user-id",
        balance: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      await expect(
        walletService.withdrawFunds({
          walletId: "wallet-id",
          amount: 500,
        }),
      ).rejects.toThrow("Insufficient wallet balance");
    });
  });

  describe("transferFunds", () => {
    it("should reject non-positive transfer amount", async () => {
      const walletService = new WalletService({} as any, {} as any);

      await expect(
        walletService.transferFunds({
          senderWalletId: "sender-wallet",
          receiverWalletId: "receiver-wallet",
          amount: 0,
        }),
      ).rejects.toThrow("Amount must be greater than zero");
    });

    it("should reject self transfer", async () => {
      const walletService = new WalletService({} as any, {} as any);

      await expect(
        walletService.transferFunds({
          senderWalletId: "wallet-id",
          receiverWalletId: "wallet-id",
          amount: 100,
        }),
      ).rejects.toThrow("Cannot transfer to the same wallet");
    });

    it("should transfer funds successfully", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findByIdForUpdate
        .mockResolvedValueOnce({
          id: "receiver-wallet",
          userId: "user-2",
          balance: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: "sender-wallet",
          userId: "user-1",
          balance: 5000,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      const result = await walletService.transferFunds({
        senderWalletId: "sender-wallet",
        receiverWalletId: "receiver-wallet",
        amount: 1000,
      });

      expect(mocks.walletRepository.updateBalance).toHaveBeenCalledTimes(2);

      expect(mocks.transactionRepository.create).toHaveBeenCalledTimes(2);

      expect(result.transferReference).toBeDefined();
    });
  });

  describe("getTransactionHistory", () => {
    it("should return transaction history", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findById.mockResolvedValue({
        id: "wallet-id",
        userId: "user-id",
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mocks.transactionRepository.findByWalletId.mockResolvedValue([
        {
          id: "transaction-id",
        },
      ]);

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      const result = await walletService.getTransactionHistory("wallet-id");

      expect(mocks.transactionRepository.findByWalletId).toHaveBeenCalledWith(
        "wallet-id",
      );

      expect(result).toHaveLength(1);
    });

    it("should throw when wallet does not exist while fetching history", async () => {
      const mocks = createMocks();

      mocks.walletRepository.findById.mockResolvedValue(null);

      const walletService = new WalletService(
        mocks.walletRepository as any,
        mocks.transactionRepository as any,
      );

      await expect(
        walletService.getTransactionHistory("wallet-id"),
      ).rejects.toThrow("Wallet not found");
    });
  });
});
