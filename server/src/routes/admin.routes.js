import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { adminService } from "../services/admin.service.js";

const router = Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.get("/dashboard-stats", async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Failed to get dashboard stats" });
  }
});

router.get("/sync-history", async (req, res) => {
  try {
    const history = await adminService.getSyncHistory(req.query);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to get sync history" });
  }
});

router.get("/channels", async (req, res) => {
  try {
    const channels = await adminService.getChannels();
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: "Failed to get channels" });
  }
});

router.post("/sync-event", async (req, res) => {
  try {
    const result = await adminService.logSyncEvent(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to log sync event" });
  }
});

export default router;
