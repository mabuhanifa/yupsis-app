import { eq } from "drizzle-orm";
import httpStatusCodes from "http-status-codes";
import { db } from "../db/index.js";
import { inventory, lineItems, orders } from "../db/schema.js";
import { ApiError } from "../utils/ApiError.js";

const createOrder = async (orderData) => {
  const { email, items } = orderData;

  if (!items || items.length === 0) {
    throw new ApiError(httpStatusCodes.BAD_REQUEST, "Cart is empty");
  }

  return db.transaction(async (tx) => {
    // 1. Get all variant details and calculate total price
    const variantIds = items.map((item) => item.id);
    const dbVariants = await tx.query.variants.findMany({
      where: (variants, { inArray }) => inArray(variants.id, variantIds),
      with: { inventory: true },
    });

    let totalPrice = 0;
    const lineItemsToInsert = [];

    for (const item of items) {
      const dbVariant = dbVariants.find((v) => v.id === item.id);
      if (!dbVariant) {
        throw new ApiError(
          httpStatusCodes.NOT_FOUND,
          `Variant with ID ${item.id} not found.`
        );
      }
      if (dbVariant.inventory.quantity < item.quantity) {
        throw new ApiError(
          httpStatusCodes.BAD_REQUEST,
          `Not enough stock for ${dbVariant.title}.`
        );
      }

      totalPrice += parseFloat(dbVariant.price) * item.quantity;
      lineItemsToInsert.push({
        variantId: item.id,
        quantity: item.quantity,
        price: dbVariant.price,
      });
    }

    // 2. Create the order
    const [newOrder] = await tx
      .insert(orders)
      .values({
        email,
        totalPrice: totalPrice.toFixed(2),
      })
      .returning();

    // 3. Create line items
    const finalLineItems = lineItemsToInsert.map((li) => ({
      ...li,
      orderId: newOrder.id,
    }));
    await tx.insert(lineItems).values(finalLineItems);

    // 4. Update inventory for each variant
    for (const item of items) {
      const dbVariant = dbVariants.find((v) => v.id === item.id);
      const newQuantity = dbVariant.inventory.quantity - item.quantity;
      await tx
        .update(inventory)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(inventory.variantId, item.id));
    }

    return { orderId: newOrder.id, ...newOrder };
  });
};

export const orderService = {
  createOrder,
};
