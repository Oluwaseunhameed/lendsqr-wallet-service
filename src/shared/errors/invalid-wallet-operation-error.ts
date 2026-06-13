import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "./app-error";

export class InvalidWalletOperationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}
