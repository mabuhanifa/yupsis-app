import httpStatusCodes from "http-status-codes";
import { orderService } from "../services/order.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const handleOrderWebhook = catchAsync(async (req, res) => {
  const payload = JSON.parse(req.rawBody);
  await orderService.createOrderFromWebhook(payload);
  res.status(httpStatusCodes.OK).send("Webhook received.");
});

const handleProductWebhook = catchAsync(async (req, res) => {
  const payload = JSON.parse(req.rawBody);
  console.log("Received product webhook:", payload);
  res.status(httpStatusCodes.OK).send("Webhook received.");
});

export const webhookController = {
  handleOrderWebhook,
  handleProductWebhook,
};
