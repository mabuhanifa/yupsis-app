import httpStatusCodes from "http-status-codes";
import { productImportQueue } from "../queues/productImport.queue.js";
import { shopifyService } from "../services/shopify.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const importFromSSActivewear = catchAsync(async (req, res) => {
  const job = await productImportQueue.add("ss-import", {});
  res.status(httpStatusCodes.ACCEPTED).json({
    message: "Product import job started.",
    jobId: job.id,
  });
});

const getImportStatus = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const job = await productImportQueue.getJob(jobId);

  if (!job) {
    return res
      .status(httpStatusCodes.NOT_FOUND)
      .json({ message: "Job not found." });
  }

  const state = await job.getState();
  const progress = job.progress;
  const returnValue = job.returnvalue;

  res.status(httpStatusCodes.OK).json({
    jobId: job.id,
    state,
    progress,
    result: returnValue,
  });
});

const deployProductToShopify = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await shopifyService.deployProduct(productId);
  res.status(httpStatusCodes.CREATED).json({
    message: "Product successfully deployed to Shopify.",
    shopifyProduct: result,
  });
});

export const integrationController = {
  importFromSSActivewear,
  getImportStatus,
  deployProductToShopify,
};
