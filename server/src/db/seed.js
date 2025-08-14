import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import fs from "fs/promises";
import path from "path";
import { Client } from "pg";
import { fileURLToPath } from "url";

import * as schema from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const db = drizzle(client, { schema });

  try {
    console.log("Seeding database...");

    // Clean up existing data in the correct order
    console.log("Clearing existing data...");
    await db.delete(schema.inventory);
    await db.delete(schema.productsToChannels);
    await db.delete(schema.productsToCategories);
    await db.delete(schema.variants);
    await db.delete(schema.products);
    await db.delete(schema.categories);
    await db.delete(schema.channels);
    console.log("Data cleared.");

    // Read product data from JSON file
    const dataPath = path.join(__dirname, "products.json");
    const productData = JSON.parse(await fs.readFile(dataPath, "utf-8"));

    // 1. Seed Channels
    console.log("Seeding channels...");
    const [shopifyChannel] = await db
      .insert(schema.channels)
      .values({ name: "Shopify" })
      .returning();
    console.log("Channels seeded.");

    // 2. Seed Categories
    console.log("Seeding categories...");
    const categoryNames = productData.map((c) => ({ name: c.category }));
    const createdCategories = await db
      .insert(schema.categories)
      .values(categoryNames)
      .returning();
    const categoryMap = new Map(createdCategories.map((c) => [c.name, c.id]));
    console.log("Categories seeded.");

    // 3. Prepare and seed Products
    console.log("Preparing and seeding products...");
    const productsToInsert = [];
    for (const categoryData of productData) {
      for (const productInfo of categoryData.products) {
        productsToInsert.push({
          ...productInfo,
          _temp_category: categoryData.category,
        });
      }
    }

    if (productsToInsert.length > 0) {
      const createdProducts = await db
        .insert(schema.products)
        .values(
          productsToInsert.map((p) => ({
            title: p.title,
            description: p.description,
            image: p.image,
            vendor: p.vendor,
          }))
        )
        .returning();
      console.log(`${createdProducts.length} products seeded.`);

      // 4. Prepare data for variants, inventory, and join tables
      const variantsToInsert = [];
      const productsToCategoriesToInsert = [];
      const productsToChannelsToInsert = [];

      for (let i = 0; i < createdProducts.length; i++) {
        const product = createdProducts[i];
        const originalProduct = productsToInsert[i];
        const categoryId = categoryMap.get(originalProduct._temp_category);

        if (categoryId) {
          productsToCategoriesToInsert.push({
            productId: product.id,
            categoryId: categoryId,
          });
        }

        productsToChannelsToInsert.push({
          productId: product.id,
          channelId: shopifyChannel.id,
        });

        for (const variantInfo of originalProduct.variants) {
          variantsToInsert.push({
            productId: product.id,
            ...variantInfo,
          });
        }
      }

      // 5. Seed Variants
      console.log("Seeding variants...");
      if (variantsToInsert.length > 0) {
        const createdVariants = await db
          .insert(schema.variants)
          .values(
            variantsToInsert.map((v) => ({
              productId: v.productId,
              title: v.title,
              sku: v.sku,
              price: v.price,
              cost: v.cost,
              grams: v.grams,
            }))
          )
          .returning();
        console.log(`${createdVariants.length} variants seeded.`);

        // 6. Prepare and seed Inventory
        console.log("Seeding inventory...");
        const variantSkuMap = new Map(
          createdVariants.map((v) => [v.sku, v.id])
        );
        const inventoryToInsert = variantsToInsert
          .map((v) => {
            const variantId = variantSkuMap.get(v.sku);
            if (!variantId) return null;
            return {
              variantId: variantId,
              quantity: v.quantity,
              location: v.location,
            };
          })
          .filter(Boolean);

        if (inventoryToInsert.length > 0) {
          await db.insert(schema.inventory).values(inventoryToInsert);
          console.log(`${inventoryToInsert.length} inventory records seeded.`);
        }
      }

      // 7. Seed join tables
      console.log("Seeding join tables...");
      if (productsToCategoriesToInsert.length > 0) {
        await db
          .insert(schema.productsToCategories)
          .values(productsToCategoriesToInsert);
      }
      if (productsToChannelsToInsert.length > 0) {
        await db
          .insert(schema.productsToChannels)
          .values(productsToChannelsToInsert);
      }
      console.log("Join tables seeded.");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

main();
