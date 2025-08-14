import { Router } from "express";
import { productController } from "../controllers/product.controller.js";

const router = Router();

router
  .route("/")
  .post(productController.createProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
