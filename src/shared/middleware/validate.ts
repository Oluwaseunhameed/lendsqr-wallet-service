import { BadRequestError } from "../errors";
import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new BadRequestError(
          result.error.issues.map((issue) => issue.message).join(", "),
        ),
      );

      return;
    }

    req.body = result.data;

    next();
  };
}
