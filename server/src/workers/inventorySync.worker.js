import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";
import { productService } from "../services/product.service.js";
import { shopifyService } from "../services/shopify.service.js";
import { ssActivewearService } from "../services/ssactivewear.service.js";

const worker = new Worker(
  "inventory-sync",
  async (job) => {
    console.log(`Processing inventory sync job ${job.id}`);
    try {
      const inventoryUpdates =
        await ssActivewearService.fetchInventoryUpdates();
      let successCount = 0;
      let failCount = 0;

      for (const update of inventoryUpdates) {
        try {
          const variant = await productService.getVariantBySku(update.sku);
          if (!variant) {
            console.warn(`Variant with SKU ${update.sku} not found. Skipping.`);
            failCount++;
            continue;
          }

          await productService.updateVariantInventory(
            variant.id,
            update.quantity
          );

          if (variant.shopifyInventoryItemId) {
            await shopifyService.updateInventory(
              variant.shopifyInventoryItemId,
              update.quantity
            );
          }
          console.log(`Synced inventory for SKU: ${update.sku}`);
          successCount++;
        } catch (error) {
          console.error(`Failed to sync SKU ${update.sku}:`, error);
          failCount++;
        }
      }
      return { status: "Completed", success: successCount, failed: failCount };
    } catch (error) {
      console.error(`Job ${job.id} failed catastrophically:`, error);
      throw error;
    }
  },
  { connection }
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} has completed! Result:`, result);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} has failed with ${err.message}`);
});

export default worker;
