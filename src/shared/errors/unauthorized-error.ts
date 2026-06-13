import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
