import { HTTP_STATUS } from "../constants/http-status";
import { AppError } from "./app-error";

export class AdjutorUnavailableError extends AppError {
  constructor() {
    super(
      "Unable to verify blacklist status at this time",
      HTTP_STATUS.SERVICE_UNAVAILABLE,
    );
  }
}
