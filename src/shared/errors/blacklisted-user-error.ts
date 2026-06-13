import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "./app-error";

export class BlacklistedUserError extends AppError {
  constructor() {
    super("User is blacklisted and cannot be onboarded", HTTP_STATUS.FORBIDDEN);
  }
}
