import { Router } from "express";
import adminRouter from "./admin.route.js";
import categoryRouter from "./category.route.js";
import healthRouter from "./health.route.js";
import integrationRouter from "./integration.route.js";
import orderRouter from "./order.route.js";
import productRouter from "./product.route.js";
import webhookRouter from "./webhook.route.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/orders", orderRouter);
router.use("/integrations", integrationRouter);
router.use("/admin", adminRouter);
router.use("/webhooks", webhookRouter);

export default router;
