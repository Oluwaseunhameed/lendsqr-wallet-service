import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().notNullable();

    table.string("first_name", 100).notNullable();

    table.string("last_name", 100).notNullable();

    table.string("email", 255).notNullable().unique();

    table.string("phone_number", 30).notNullable().unique();

    table.string("password_hash", 255).notNullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("deleted_at").nullable();

    table.index(["email"]);

    table.index(["phone_number"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
