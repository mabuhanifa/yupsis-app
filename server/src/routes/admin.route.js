import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";

const router = Router();

router.post("/sync/inventory/start", adminController.triggerInventorySync);
router.get("/sync/inventory/status", adminController.getSyncStatus);
router.get("/dashboard/stats", adminController.getDashboardStats);
router.get("/sync/history", adminController.getSyncHistory);
router.get("/channels", adminController.getChannels);

export default router;
