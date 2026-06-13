export interface Session {
  id: string;
  userId: string;
  tokenId: string;
  isActive: boolean;
  createdAt: Date;
  revokedAt: Date | null;
}

export interface SessionRow {
  id: string;
  user_id: string;
  token_id: string;
  is_active: boolean;
  created_at: Date;
  revoked_at: Date | null;
}

export interface CreateSessionInput {
  id: string;
  userId: string;
  tokenId: string;
}
