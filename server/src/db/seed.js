import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "./index.js";
import * as schema from "./schema.js";

/**
 * To run this seed script:
 * 1. Make sure you have dependencies installed:
 *    npm install -D @faker-js/faker bcrypt tsx
 * 2. Make sure your .env file has the correct DATABASE_URL.
 * 3. Run the script from your project root:
 *    npx tsx ./src/db/seed.js
 */

const main = async () => {
  console.log("Seeding database...");

  // Clean up existing data
  console.log("Clearing old data...");
  await db.delete(schema.productsToCategories);
  await db.delete(schema.productsToChannels);
  await db.delete(schema.lineItems);
  await db.delete(schema.inventory);
  await db.delete(schema.variants);
  await db.delete(schema.orders);
  await db.delete(schema.products);
  await db.delete(schema.categories);
  await db.delete(schema.channels);
  await db.delete(schema.users);
  await db.delete(schema.syncHistory);

  // --- Create Channels ---
  console.log("Creating channels...");
  const createdChannels = await db
    .insert(schema.channels)
    .values([{ name: "Shopify" }, { name: "Amazon" }])
    .returning();

  // --- Create Categories ---
  console.log("Creating categories...");
  const categoriesToInsert = Array.from({ length: 25 }, () => ({
    name: faker.commerce.department() + " " + faker.string.uuid().slice(0, 4),
  }));
  const createdCategories = await db
    .insert(schema.categories)
    .values(categoriesToInsert)
    .returning();

  // --- Create Products ---
  console.log("Creating products...");
  const productsToInsert = Array.from({ length: 30 }, () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: faker.image.url(),
    vendor: faker.company.name(),
    shopifyProductId: faker.string.numeric(13),
  }));
  const createdProducts = await db
    .insert(schema.products)
    .values(productsToInsert)
    .returning();

  const productsToCategoriesToInsert = [];
  const productsToChannelsToInsert = [];
  const variantsToInsert = [];

  for (const product of createdProducts) {
    // Link product to 1-3 categories
    faker.helpers
      .arrayElements(createdCategories, { min: 1, max: 3 })
      .forEach((category) => {
        productsToCategoriesToInsert.push({
          productId: product.id,
          categoryId: category.id,
        });
      });

    // Link product to 1-2 channels
    faker.helpers
      .arrayElements(createdChannels, { min: 1, max: 2 })
      .forEach((channel) => {
        productsToChannelsToInsert.push({
          productId: product.id,
          channelId: channel.id,
        });
      });

    // Create 1-3 variants for the product
    for (let j = 0; j < faker.number.int({ min: 1, max: 3 }); j++) {
      const price = faker.commerce.price();
      variantsToInsert.push({
        productId: product.id,
        title: faker.commerce.productAdjective(),
        sku: faker.string.alphanumeric(8).toUpperCase() + j, // ensure uniqueness
        price: price,
        cost: (parseFloat(price) * 0.6).toFixed(2),
        grams: faker.number.int({ min: 100, max: 2000 }),
        shopifyVariantId: faker.string.numeric(13),
        shopifyInventoryItemId: faker.string.numeric(13),
      });
    }
  }

  console.log("Inserting variants and relations...");
  const createdVariants = await db
    .insert(schema.variants)
    .values(variantsToInsert)
    .returning();

  const inventoryToInsert = createdVariants.map((variant) => ({
    variantId: variant.id,
    quantity: faker.number.int({ min: 0, max: 100 }),
    location: "Main Warehouse",
  }));

  if (inventoryToInsert.length > 0) {
    await db.insert(schema.inventory).values(inventoryToInsert);
  }
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

  // --- Create Admin User ---
  console.log("Creating admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(schema.users).values({
    email: "admin@example.com",
    password: hashedPassword,
  });

  // --- Create Orders and Line Items ---
  console.log("Creating orders and line items...");
  const ordersToInsert = Array.from({ length: 15 }, () => ({
    shopifyOrderId: faker.string.numeric(13),
    email: faker.internet.email(),
    totalPrice: "0", // Placeholder
  }));
  const createdOrders = await db
    .insert(schema.orders)
    .values(ordersToInsert)
    .returning();

  const lineItemsToInsert = [];
  const orderTotals = new Map();

  for (const order of createdOrders) {
    let orderTotalPrice = 0;
    const selectedVariants = faker.helpers.arrayElements(createdVariants, {
      min: 1,
      max: 4,
    });

    for (const variant of selectedVariants) {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = parseFloat(variant.price);
      orderTotalPrice += price * quantity;

      lineItemsToInsert.push({
        orderId: order.id,
        variantId: variant.id,
        shopifyProductId: faker.string.numeric(13),
        shopifyVariantId: faker.string.numeric(13),
        quantity: quantity,
        price: price.toFixed(2),
      });
    }
    orderTotals.set(order.id, orderTotalPrice.toFixed(2));
  }

  if (lineItemsToInsert.length > 0) {
    await db.insert(schema.lineItems).values(lineItemsToInsert);
  }

  console.log("Updating order totals...");
  for (const [orderId, totalPrice] of orderTotals.entries()) {
    await db
      .update(schema.orders)
      .set({ totalPrice })
      .where(eq(schema.orders.id, orderId));
  }

  // --- Create Sync History ---
  console.log("Creating sync history...");
  const syncHistoryToInsert = Array.from({ length: 10 }, () => ({
    channel: faker.helpers.arrayElement(createdChannels).name,
    status: faker.helpers.arrayElement(["Success", "Failed", "In Progress"]),
    details: faker.lorem.sentence(),
  }));
  await db.insert(schema.syncHistory).values(syncHistoryToInsert);

  console.log("Database seeded successfully!");
  process.exit(0);
};

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
