import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./shared/utils/logger";
import { router } from "./routes";
import { errorHandler } from "./shared/middleware/error-handler";
import { NotFoundError } from "./shared/errors";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(
  pinoHttp({
    logger,
  }),
);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    service: "Lendsqr Wallet Service",
    version: "v1",
    health: "/health",
  });
});

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Wallet service is running",
  });
});

app.use("/api/v1", router);

app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

app.use(errorHandler);

export default app;
