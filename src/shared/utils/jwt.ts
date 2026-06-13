import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import { AccessTokenPayload } from "../types";

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "1d",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwtSecret);

  return decoded as AccessTokenPayload;
}
