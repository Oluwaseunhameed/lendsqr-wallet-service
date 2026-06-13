export interface KarmaLookupResponse {
  status: "success" | "error";
  message: string;
  data: KarmaRecord | null;
  meta?: {
    cost: number;
    balance: number;
  };
}

export interface KarmaRecord {
  karma_identity: string;
  amount_in_contention: string;
  reason: string | null;
  default_date: string | null;
}

export interface BlacklistCheckResult {
  isBlacklisted: boolean;
  record: KarmaRecord | null;
}
