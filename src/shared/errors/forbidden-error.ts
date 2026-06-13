import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}
