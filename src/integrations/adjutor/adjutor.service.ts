import { AdjutorUnavailableError } from "../../shared/errors";

import { AdjutorClient } from "./adjutor.client";

import { BlacklistCheckResult } from "./adjutor.types";

export class AdjutorService {
  constructor(private readonly adjutorClient = new AdjutorClient()) {}

  async checkIdentity(identity: string): Promise<BlacklistCheckResult> {
    // Temporal test for blacklisted identity
    /*
    if (identity === "blacklisted@test.com") {
      return {
        isBlacklisted: true,
        record: {
          karma_identity: identity,
          amount_in_contention: "10000",
          reason: "Test Blacklist",
          default_date: "2025-06-13",
        },
      };
    }
      */
    try {
      const response = await this.adjutorClient.karmaLookup(identity);

      const isBlacklisted =
        response.status === "success" && response.data !== null;

      return {
        isBlacklisted,
        record: isBlacklisted ? response.data : null,
      };
    } catch {
      throw new AdjutorUnavailableError();
    }
  }
}
