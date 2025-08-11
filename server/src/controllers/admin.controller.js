import httpStatusCodes from "http-status-codes";
import { inventorySyncQueue } from "../queues/inventorySync.queue.js";
import { adminService } from "../services/admin.service.js";
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

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(httpStatusCodes.OK).json(stats);
});

const getSyncHistory = catchAsync(async (req, res) => {
  const history = await adminService.getSyncHistory(req.query);
  res.status(httpStatusCodes.OK).json(history);
});

const getChannels = catchAsync(async (req, res) => {
  const channels = await adminService.getChannels();
  res.status(httpStatusCodes.OK).json(channels);
});

export const adminController = {
  triggerInventorySync,
  getSyncStatus,
  getDashboardStats,
  getSyncHistory,
  getChannels,
};
