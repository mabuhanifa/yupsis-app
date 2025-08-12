import httpStatusCodes from "http-status-codes";
import { productService } from "../services/product.service.js";

export const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(httpStatusCodes.CREATED).json(product);
  } catch (error) {
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error creating product" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    res.status(httpStatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error fetching products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(httpStatusCodes.OK).json(product);
  } catch (error) {
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error fetching product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct(id, req.body);
    res.status(httpStatusCodes.OK).json(updatedProduct);
  } catch (error) {
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    res.status(httpStatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error deleting product" });
  }
};

export const productController = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

export default productController;
