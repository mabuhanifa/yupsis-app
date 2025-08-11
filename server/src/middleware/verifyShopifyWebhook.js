import crypto from "crypto";
import httpStatusCodes from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

const verifyShopifyWebhook = (req, res, next) => {
  const hmac = req.get("X-Shopify-Hmac-Sha256");
  const body = req.rawBody;
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!hmac || !body || !shopifySecret) {
    throw new ApiError(httpStatusCodes.BAD_REQUEST, "Cannot verify webhook.");
  }

  const hash = crypto
    .createHmac("sha256", shopifySecret)
    .update(body, "utf8")
    .digest("base64");

  if (hash === hmac) {
    next();
  } else {
    throw new ApiError(
      httpStatusCodes.UNAUTHORIZED,
      "Webhook verification failed."
    );
  }
};

export { verifyShopifyWebhook };
