import { sql } from "drizzle-orm";
import { db } from "./index.js";

/**
 * To run this script:
 * 1. Make sure your .env file has the correct DATABASE_URL.
 * 2. Run the script from your project root:
 *    pnpm db:drop
 */

const main = async () => {
  console.log("Dropping all tables...");

  const tableNames = [
    "products_to_categories",
    "products_to_channels",
    "line_items",
    "inventory",
    "variants",
    "orders",
    "products",
    "categories",
    "channels",
    "users",
    "sync_history",
  ];

  try {
    for (const tableName of tableNames) {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`));
      console.log(`Dropped table: ${tableName}`);
    }
    // Also drop drizzle's migration table
    await db.execute(
      sql.raw(`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;`)
    );
    console.log(`Dropped table: __drizzle_migrations`);

    console.log("All tables dropped successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error dropping tables:", err);
    process.exit(1);
  }
};

main();
