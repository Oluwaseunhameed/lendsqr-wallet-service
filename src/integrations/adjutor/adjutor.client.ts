import axios, { AxiosInstance } from "axios";

import { env } from "../../config/env";

import { KarmaLookupResponse } from "./adjutor.types";

export class AdjutorClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.adjutorBaseUrl,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${env.adjutorApiKey}`,
      },
    });
  }

  async karmaLookup(identity: string): Promise<KarmaLookupResponse> {
    const response = await this.client.get<KarmaLookupResponse>(
      `/verification/karma/${encodeURIComponent(identity)}`,
    );

    return response.data;
  }
}
