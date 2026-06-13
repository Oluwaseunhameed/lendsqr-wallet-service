import { db } from "../../config/knex";
import { DatabaseTransaction } from "../../shared/types/database-transaction";

import { SessionMapper } from "./session.mapper";
import { CreateSessionInput, Session, SessionRow } from "./session.types";

export class SessionRepository {
  async create(
    payload: CreateSessionInput,
    trx?: DatabaseTransaction,
  ): Promise<void> {
    const dbOrTx = trx ?? db;

    await dbOrTx("sessions").insert({
      id: payload.id,
      user_id: payload.userId,
      token_id: payload.tokenId,
    });
  }

  async findActiveByTokenId(
    tokenId: string,
    trx?: DatabaseTransaction,
  ): Promise<Session | null> {
    const dbOrTx = trx ?? db;

    const row = await dbOrTx<SessionRow>("sessions")
      .where({
        token_id: tokenId,
        is_active: true,
      })
      .first();

    return row ? SessionMapper.toDomain(row) : null;
  }

  async revoke(sessionId: string, trx?: DatabaseTransaction): Promise<void> {
    const dbOrTx = trx ?? db;

    await dbOrTx("sessions")
      .where({
        id: sessionId,
      })
      .update({
        is_active: false,
        revoked_at: db.fn.now(),
      });
  }
}
