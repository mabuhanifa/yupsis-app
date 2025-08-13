import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.post("/login", authController.login);
router.get("/profile", auth(), authController.getProfile);

export default router;
