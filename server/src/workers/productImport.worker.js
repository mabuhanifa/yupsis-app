import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";
import { productService } from "../services/product.service.js";
import { ssActivewearService } from "../services/ssactivewear.service.js";
import { transformService } from "../services/transform.service.js";

const worker = new Worker(
  "product-import",
  async (job) => {
    console.log(`Processing job ${job.id}`);
    try {
      const productsFromApi = await ssActivewearService.fetchProducts();

      for (const apiProduct of productsFromApi) {
        const transformedData = transformService.transformProduct(apiProduct);
        await productService.createProduct(transformedData);
        console.log(`Imported product: ${transformedData.title}`);
      }

      return { status: "Completed" };
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      throw error; // Re-throw to let BullMQ handle the failure
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} has failed with ${err.message}`);
});

export default worker;
