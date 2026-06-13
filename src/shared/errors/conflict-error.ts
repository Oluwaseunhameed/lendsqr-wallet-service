import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "../errors";

export class ConflictError extends AppError {
  constructor(message = "Conflict occurred") {
    super(message, HTTP_STATUS.CONFLICT);
  }
}
