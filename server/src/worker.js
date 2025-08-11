import "dotenv/config";
import { scheduleInventorySync } from "./queues/inventorySync.queue.js";
import inventorySyncWorker from "./workers/inventorySync.worker.js";
import "./workers/productImport.worker.js";

console.log("Worker process started.");

inventorySyncWorker.on("ready", () => {
  console.log("Inventory sync worker is ready.");
  // Schedule the recurring job once the worker is ready.
  scheduleInventorySync().then(() => {
    console.log("Inventory sync job has been scheduled.");
  });
});
