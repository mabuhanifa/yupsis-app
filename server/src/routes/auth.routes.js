import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authService } from "../services/auth.service.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// GET /api/auth/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const userProfile = await authService.getProfile(req.user.id);
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Optional: POST /api/auth/register - for creating the first admin user.
// Should be removed or protected after initial setup.
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const newUser = await authService.register(email, password);
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

export default router;
