import { db } from "../../config/knex";

export async function checkDatabaseConnection() {
  await db.raw("SELECT 1");
}
