import httpStatusCodes from "http-status-codes";
import { orderService } from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(httpStatusCodes.CREATED).json(order);
  } catch (error) {
    res
      .status(error.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error creating order" });
  }
};
