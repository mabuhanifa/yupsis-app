import httpStatusCodes from "http-status-codes";
import { inventorySyncQueue } from "../queues/inventorySync.queue.js";
import { catchAsync } from "../utils/catchAsync.js";

const triggerInventorySync = catchAsync(async (req, res) => {
  const job = await inventorySyncQueue.add("manual-sync", {});
  res.status(httpStatusCodes.ACCEPTED).json({
    message: "Manual inventory sync job started.",
    jobId: job.id,
  });
});

const getSyncStatus = catchAsync(async (req, res) => {
  const repeatableJobs = await inventorySyncQueue.getRepeatableJobs();
  res.status(httpStatusCodes.OK).json({
    message: "Inventory sync status.",
    repeatableJobs,
  });
});

export const adminController = {
  triggerInventorySync,
  getSyncStatus,
};
