jest.mock("../../../config/knex", () => ({
  db: {
    transaction: jest.fn(),
  },
}));

jest.mock("../../../shared/utils/password", () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
}));

jest.mock("../../../shared/utils/jwt", () => ({
  generateAccessToken: jest.fn(),
}));

import { AuthService } from "../auth.service";

import { db } from "../../../config/knex";

import { comparePassword, hashPassword } from "../../../shared/utils/password";

import { generateAccessToken } from "../../../shared/utils/jwt";

function createMocks() {
  return {
    userRepository: {
      findByEmail: jest.fn(),
      findByPhoneNumber: jest.fn(),
      create: jest.fn(),
    },

    walletRepository: {
      create: jest.fn(),
    },

    sessionRepository: {
      create: jest.fn(),
      revoke: jest.fn(),
    },

    adjutorService: {
      checkIdentity: jest.fn(),
    },
  };
}

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (db.transaction as jest.Mock).mockImplementation(async (callback) =>
      callback({}),
    );
  });

  describe("signup", () => {
    it("should signup successfully", async () => {
      const mocks = createMocks();

      mocks.adjutorService.checkIdentity.mockResolvedValue({
        isBlacklisted: false,
        record: null,
      });

      mocks.userRepository.findByEmail.mockResolvedValue(null);

      mocks.userRepository.findByPhoneNumber.mockResolvedValue(null);

      (hashPassword as jest.Mock).mockResolvedValue("hashed-password");

      (generateAccessToken as jest.Mock).mockReturnValue("jwt-token");

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      const result = await authService.signup({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "08012345678",
        password: "Password123!",
      });

      expect(mocks.adjutorService.checkIdentity).toHaveBeenCalledTimes(2);

      expect(mocks.userRepository.create).toHaveBeenCalled();

      expect(mocks.walletRepository.create).toHaveBeenCalled();

      expect(mocks.sessionRepository.create).toHaveBeenCalled();

      expect(result).toEqual({
        accessToken: "jwt-token",
      });
    });

    it("should throw when email already exists", async () => {
      const mocks = createMocks();

      mocks.adjutorService.checkIdentity.mockResolvedValue({
        isBlacklisted: false,
        record: null,
      });

      mocks.userRepository.findByEmail.mockResolvedValue({
        id: "user-id",
      });

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      await expect(
        authService.signup({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "08012345678",
          password: "Password123!",
        }),
      ).rejects.toThrow("Email already exists");
    });

    it("should throw when phone number already exists", async () => {
      const mocks = createMocks();

      mocks.adjutorService.checkIdentity.mockResolvedValue({
        isBlacklisted: false,
        record: null,
      });

      mocks.userRepository.findByEmail.mockResolvedValue(null);

      mocks.userRepository.findByPhoneNumber.mockResolvedValue({
        id: "user-id",
      });

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      await expect(
        authService.signup({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "08012345678",
          password: "Password123!",
        }),
      ).rejects.toThrow("Phone number already exists");
    });

    it("should reject blacklisted email", async () => {
      const mocks = createMocks();

      mocks.adjutorService.checkIdentity.mockResolvedValue({
        isBlacklisted: true,
        record: null,
      });

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      await expect(
        authService.signup({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "08012345678",
          password: "Password123!",
        }),
      ).rejects.toThrow();
    });

    it("should reject blacklisted phone number", async () => {
      const mocks = createMocks();

      mocks.adjutorService.checkIdentity
        .mockResolvedValueOnce({
          isBlacklisted: false,
          record: null,
        })
        .mockResolvedValueOnce({
          isBlacklisted: true,
          record: null,
        });

      mocks.userRepository.findByEmail.mockResolvedValue(null);

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      await expect(
        authService.signup({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phoneNumber: "08012345678",
          password: "Password123!",
        }),
      ).rejects.toThrow();
    });
  });

  describe("signin", () => {
    it("should signin successfully", async () => {
      const mocks = createMocks();

      mocks.userRepository.findByEmail.mockResolvedValue({
        id: "user-id",
        passwordHash: "hashed-password",
      });

      (comparePassword as jest.Mock).mockResolvedValue(true);

      (generateAccessToken as jest.Mock).mockReturnValue("jwt-token");

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      const result = await authService.signin({
        email: "john@example.com",
        password: "Password123!",
      });

      expect(mocks.sessionRepository.create).toHaveBeenCalled();

      expect(result).toEqual({
        accessToken: "jwt-token",
      });
    });

    it("should throw when user does not exist", async () => {
      const mocks = createMocks();

      mocks.userRepository.findByEmail.mockResolvedValue(null);

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      await expect(
        authService.signin({
          email: "john@example.com",
          password: "Password123!",
        }),
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw when password is invalid", async () => {
      const mocks = createMocks();

      mocks.userRepository.findByEmail.mockResolvedValue({
        id: "user-id",
        passwordHash: "hashed-password",
      });

      (comparePassword as jest.Mock).mockResolvedValue(false);

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      await expect(
        authService.signin({
          email: "john@example.com",
          password: "Password123!",
        }),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("signout", () => {
    it("should revoke session", async () => {
      const mocks = createMocks();

      const authService = new AuthService(
        mocks.userRepository as any,
        mocks.walletRepository as any,
        mocks.sessionRepository as any,
        mocks.adjutorService as any,
      );

      await authService.signout("session-id");

      expect(mocks.sessionRepository.revoke).toHaveBeenCalledWith("session-id");
    });
  });
});
