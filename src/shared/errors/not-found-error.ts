import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
