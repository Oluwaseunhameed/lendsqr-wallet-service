import { randomUUID } from "crypto";

import { db } from "../../config/knex";

import { ConflictError } from "../../shared/errors/conflict-error";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error";

import { generateAccessToken } from "../../shared/utils/jwt";

import { UserRepository } from "../users/user.repository";
import { WalletRepository } from "../wallets/wallet.repository";

import { AuthResponse, SigninInput, SignupInput } from "./auth.types";

import { SessionRepository } from "./session.repository";
import { comparePassword, hashPassword } from "../../shared/utils/password";

export class AuthService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly walletRepository = new WalletRepository(),
    private readonly sessionRepository = new SessionRepository(),
  ) {}

  async signup(payload: SignupInput): Promise<AuthResponse> {
    const email = payload.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const existingPhone = await this.userRepository.findByPhoneNumber(
      payload.phoneNumber,
    );

    if (existingPhone) {
      throw new ConflictError("Phone number already exists");
    }

    const passwordHash = await hashPassword(payload.password);

    const userId = randomUUID();
    const walletId = randomUUID();
    const sessionId = randomUUID();
    const tokenId = randomUUID();

    await db.transaction(async (trx) => {
      await this.userRepository.create(
        {
          id: userId,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
          passwordHash,
        },
        trx,
      );

      await this.walletRepository.create(
        {
          id: walletId,
          userId,
        },
        trx,
      );

      await this.sessionRepository.create(
        {
          id: sessionId,
          userId,
          tokenId,
        },
        trx,
      );
    });

    const accessToken = generateAccessToken({
      sub: userId,
      sessionId,
    });

    return {
      accessToken,
    };
  }

  async signin(payload: SigninInput): Promise<AuthResponse> {
    const email = payload.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const passwordMatches = await comparePassword(
      payload.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const sessionId = randomUUID();
    const tokenId = randomUUID();

    await this.sessionRepository.create({
      id: sessionId,
      userId: user.id,
      tokenId,
    });

    const accessToken = generateAccessToken({
      sub: user.id,
      sessionId,
    });

    return {
      accessToken,
    };
  }

  async signout(sessionId: string): Promise<void> {
    await this.sessionRepository.revoke(sessionId);
  }
}
