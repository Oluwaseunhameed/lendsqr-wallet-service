import { Session, SessionRow } from "./session.types";

export class SessionMapper {
  static toDomain(row: SessionRow): Session {
    return {
      id: row.id,
      userId: row.user_id,
      tokenId: row.token_id,
      isActive: row.is_active,
      createdAt: row.created_at,
      revokedAt: row.revoked_at,
    };
  }
}
