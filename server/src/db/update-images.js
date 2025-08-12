import { faker } from "@faker-js/faker";
import { eq, isNull } from "drizzle-orm";
import { db } from "./index.js";
import * as schema from "./schema.js";

/**
 * To run this script:
 * 1. Make sure your .env file has the correct DATABASE_URL.
 * 2. Run the script from your project root:
 *    pnpm db:update-images
 */

const main = async () => {
  console.log("Updating existing products with images...");

  const productsToUpdate = await db
    .select({ id: schema.products.id })
    .from(schema.products)
    .where(isNull(schema.products.image));

  if (productsToUpdate.length === 0) {
    console.log("All products already have images.");
    process.exit(0);
  }

  console.log(`Found ${productsToUpdate.length} products missing an image.`);

  for (const product of productsToUpdate) {
    await db
      .update(schema.products)
      .set({ image: faker.image.url() })
      .where(eq(schema.products.id, product.id));
  }

  console.log(
    `Successfully updated images for ${productsToUpdate.length} products.`
  );
  process.exit(0);
};

main().catch((err) => {
  console.error("Error updating product images:", err);
  process.exit(1);
});
