import { Router } from "express";
import { webhookController } from "../controllers/webhook.controller.js";
import { verifyShopifyWebhook } from "../middleware/verifyShopifyWebhook.js";

const router = Router();

router.use("/shopify", verifyShopifyWebhook);

router.post("/shopify/orders", webhookController.handleOrderWebhook);
router.post("/shopify/products", webhookController.handleProductWebhook);

export default router;
