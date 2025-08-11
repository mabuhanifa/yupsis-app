import { Router } from "express";
import healthRouter from "./health.route.js";
import integrationRouter from "./integration.route.js";
import productRouter from "./product.route.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productRouter);
router.use("/integrations", integrationRouter);

export default router;
