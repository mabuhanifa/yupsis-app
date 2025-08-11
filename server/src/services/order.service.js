import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { lineItems, orders, variants } from "../db/schema.js";

const createOrderFromWebhook = async (payload) => {
  return db.transaction(async (tx) => {
    const [newOrder] = await tx
      .insert(orders)
      .values({
        shopifyOrderId: payload.id,
        email: payload.email,
        totalPrice: payload.total_price,
      })
      .returning();

    for (const item of payload.line_items) {
      const ourVariant = await tx.query.variants.findFirst({
        where: eq(variants.sku, item.sku),
      });

      await tx.insert(lineItems).values({
        orderId: newOrder.id,
        variantId: ourVariant?.id || null,
        shopifyProductId: item.product_id,
        shopifyVariantId: item.variant_id,
        quantity: item.quantity,
        price: item.price,
      });
    }
    return newOrder;
  });
};

export const orderService = {
  createOrderFromWebhook,
};
