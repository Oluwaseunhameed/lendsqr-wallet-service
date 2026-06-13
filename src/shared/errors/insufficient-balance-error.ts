import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "./app-error";

export class InsufficientBalanceError extends AppError {
  constructor() {
    super("Insufficient wallet balance", HTTP_STATUS.BAD_REQUEST);
  }
}
