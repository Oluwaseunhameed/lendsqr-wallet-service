import { db } from "../../config/knex";
import { CreateUserInput, User, UserRow } from "./user.types";
import { UserMapper } from "./user.mapper";
import { DatabaseTransaction } from "../../shared/types/database-transaction";

export class UserRepository {
  async findById(id: string, trx?: DatabaseTransaction): Promise<User | null> {
    const dbOrTx = trx ?? db;

    const row = await dbOrTx<UserRow>("users")
      .where({ id })
      .whereNull("deleted_at")
      .first();

    return row ? UserMapper.toDomain(row) : null;
  }

  async findByEmail(
    email: string,
    trx?: DatabaseTransaction,
  ): Promise<User | null> {
    const dbOrTx = trx ?? db;

    const row = await dbOrTx<UserRow>("users")
      .where({
        email,
      })
      .whereNull("deleted_at")
      .first();

    return row ? UserMapper.toDomain(row) : null;
  }

  async findByPhoneNumber(
    phoneNumber: string,
    trx?: DatabaseTransaction,
  ): Promise<User | null> {
    const dbOrTx = trx ?? db;

    const row = await dbOrTx<UserRow>("users")
      .where({
        phone_number: phoneNumber,
      })
      .whereNull("deleted_at")
      .first();

    return row ? UserMapper.toDomain(row) : null;
  }

  async create(
    payload: CreateUserInput,
    trx?: DatabaseTransaction,
  ): Promise<void> {
    const dbOrTx = trx ?? db;

    await dbOrTx("users").insert({
      id: payload.id,
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      phone_number: payload.phoneNumber,
      password_hash: payload.passwordHash,
    });
  }
}
