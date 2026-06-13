import { NextFunction, Request, Response } from "express";

import { AppError } from "../errors";
import { HTTP_STATUS } from "../constants/http-status";
import { logger } from "../utils/logger";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
  });
}
