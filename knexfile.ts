import type { Knex } from "knex";
import { knexConfig } from "./src/config/knex.config";

const config: Record<string, Knex.Config> = {
  development: knexConfig,
};

export default config;
