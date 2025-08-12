import httpStatusCodes from "http-status-codes";
import { categoryService } from "../services/category.service.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(httpStatusCodes.OK).json(categories);
  } catch (error) {
    console.error("Error in getAllCategories controller:", error);
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error fetching categories" });
  }
};
