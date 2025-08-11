import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const inventorySyncQueue = new Queue("inventory-sync", { connection });

export const scheduleInventorySync = async () => {
  await inventorySyncQueue.add(
    "sync-inventory",
    {},
    {
      repeat: {
        cron: "*/5 * * * *",
      },
      jobId: "recurring-inventory-sync",
    }
  );
};
