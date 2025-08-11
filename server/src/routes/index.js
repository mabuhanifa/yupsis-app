import { Router } from "express";
import adminRouter from "./admin.route.js";
import healthRouter from "./health.route.js";
import integrationRouter from "./integration.route.js";
import productRouter from "./product.route.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/products", productRouter);
router.use("/integrations", integrationRouter);
router.use("/admin", adminRouter);

export default router;
