import httpStatusCodes from "http-status-codes";
import { ApiError } from "./ApiError.js";

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(httpStatusCodes.NOT_FOUND, message);
  }
}

export { NotFoundError };
