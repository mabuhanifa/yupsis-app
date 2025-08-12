import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";

const router = Router();

router.route("/").get(categoryController.getAllCategories);

export default router;
