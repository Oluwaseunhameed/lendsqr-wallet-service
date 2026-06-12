import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().notNullable();

    table.uuid("wallet_id").notNullable();

    table.string("reference", 100).notNullable().unique();

    table.string("transfer_reference", 100).nullable();

    table.string("type", 50).notNullable();

    table.decimal("amount", 18, 2).notNullable();

    table.decimal("balance_before", 18, 2).notNullable();

    table.decimal("balance_after", 18, 2).notNullable();

    table.json("metadata").nullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table
      .foreign("wallet_id")
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");

    table.index(["wallet_id"]);

    table.index(["reference"]);

    table.index(["created_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}
