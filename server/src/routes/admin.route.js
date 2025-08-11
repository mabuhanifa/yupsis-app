import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";

const router = Router();

router.post("/sync/inventory/start", adminController.triggerInventorySync);
router.get("/sync/inventory/status", adminController.getSyncStatus);

export default router;
