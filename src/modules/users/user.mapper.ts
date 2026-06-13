import { User, UserRow } from "./user.types";

export class UserMapper {
  static toDomain(row: UserRow): User {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phoneNumber: row.phone_number,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      deletedAt: row.deleted_at,
    };
  }
}
