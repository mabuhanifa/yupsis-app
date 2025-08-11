import httpStatusCodes from "http-status-codes";
import { productService } from "../services/product.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatusCodes.CREATED).json(product);
});

const getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getProducts(req.query);
  res.status(httpStatusCodes.OK).json(products);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(httpStatusCodes.OK).json(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(httpStatusCodes.OK).json(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);
  res.status(httpStatusCodes.OK).json(result);
});

export const productController = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
