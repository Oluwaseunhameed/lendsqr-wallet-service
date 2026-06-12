import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sessions", (table) => {
    table.uuid("id").primary().notNullable();

    table.uuid("user_id").notNullable();

    table.string("token_id", 255).notNullable().unique();

    table.boolean("is_active").notNullable().defaultTo(true);

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("revoked_at").nullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.index(["user_id"]);

    table.index(["token_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("sessions");
}
