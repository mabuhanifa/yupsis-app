import { Router } from "express";
import { integrationController } from "../controllers/integration.controller.js";

const router = Router();

router.post(
  "/ssactivewear/import",
  integrationController.importFromSSActivewear
);
router.get(
  "/ssactivewear/status/:jobId",
  integrationController.getImportStatus
);

export default router;
