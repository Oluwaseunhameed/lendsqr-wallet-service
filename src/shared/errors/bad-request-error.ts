import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors";

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}
