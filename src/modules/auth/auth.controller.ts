import { Request, Response } from "express";

import { HTTP_STATUS } from "../../shared/constants/http-status";

import { sendSuccess } from "../../shared/responses/response-builder";
import { asyncHandler } from "../../shared/utils/async-handler";

import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.signup(req.body);

    sendSuccess(
      res,
      HTTP_STATUS.CREATED,
      "Account created successfully",
      result,
    );
  });

  signin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.signin(req.body);

    sendSuccess(res, HTTP_STATUS.OK, "Signin successful", result);
  });

  signout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.body;

    await this.authService.signout(sessionId);

    sendSuccess(res, HTTP_STATUS.OK, "Signout successful");
  });
}
