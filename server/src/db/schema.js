import { relations } from "drizzle-orm";
import {
  bigint,
  decimal,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Channels Table (e.g., Shopify, Amazon)
export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Categories Table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products Table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  vendor: varchar("vendor", { length: 255 }),
  shopifyProductId: varchar("shopify_product_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products Relations
export const productsRelations = relations(products, ({ many }) => ({
  variants: many(variants),
  productsToCategories: many(productsToCategories),
  productsToChannels: many(productsToChannels),
}));

// Variants Table
export const variants = pgTable("variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 255 }).notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  grams: integer("grams"),
  shopifyVariantId: varchar("shopify_variant_id", { length: 255 }),
  shopifyInventoryItemId: varchar("shopify_inventory_item_id", {
    length: 255,
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Variants Relations
export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  inventory: one(inventory),
}));

// Inventory Table
export const inventory = pgTable("inventory", {
  id: uuid("id").primaryKey().defaultRandom(),
  variantId: uuid("variant_id")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(0),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Inventory Relations
export const inventoryRelations = relations(inventory, ({ one }) => ({
  variant: one(variants, {
    fields: [inventory.variantId],
    references: [variants.id],
  }),
}));

// Join table for Products and Categories (Many-to-Many)
export const productsToCategories = pgTable(
  "products_to_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.categoryId] }),
  })
);

export const productsToCategoriesRelations = relations(
  productsToCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productsToCategories.productId],
      references: [products.id],
    }),
    category: one(categories, {
      fields: [productsToCategories.categoryId],
      references: [categories.id],
    }),
  })
);

// Join table for Products and Channels (Many-to-Many)
export const productsToChannels = pgTable(
  "products_to_channels",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    channelId: uuid("channel_id")
      .notNull()
      .references(() => channels.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.channelId] }),
  })
);

export const productsToChannelsRelations = relations(
  productsToChannels,
  ({ one }) => ({
    product: one(products, {
      fields: [productsToChannels.productId],
      references: [products.id],
    }),
    channel: one(channels, {
      fields: [productsToChannels.channelId],
      references: [channels.id],
    }),
  })
);

// Sync History Table
export const syncHistory = pgTable("sync_history", {
  id: serial("id").primaryKey(),
  channel: varchar("channel", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  shopifyOrderId: bigint("shopify_order_id", { mode: "number" })
    .notNull()
    .unique(),
  email: varchar("email", { length: 255 }),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  lineItems: many(lineItems),
}));

// Line Items Table
export const lineItems = pgTable("line_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => variants.id, {
    onDelete: "set null",
  }),
  shopifyProductId: bigint("shopify_product_id", { mode: "number" }),
  shopifyVariantId: bigint("shopify_variant_id", { mode: "number" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const lineItemsRelations = relations(lineItems, ({ one }) => ({
  order: one(orders, {
    fields: [lineItems.orderId],
    references: [orders.id],
  }),
  variant: one(variants, {
    fields: [lineItems.variantId],
    references: [variants.id],
  }),
}));

// New users table for admin authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
