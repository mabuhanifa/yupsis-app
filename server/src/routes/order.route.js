import { Router } from "express";
import * as orderController from "../controllers/order.controller.js";

const router = Router();

router.route("/").post(orderController.createOrder);

export default router;
