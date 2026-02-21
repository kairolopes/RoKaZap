import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import { json, urlencoded } from "body-parser";
import * as Sentry from "@sentry/node";
import { apiRouter } from "./web/apiRouter";
import { errorHandler } from "./web/errorHandler";

const app = express();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.5,
  });
  app.use(Sentry.Handlers.requestHandler());
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(morgan("combined"));

app.get("/health", (_req, res) => {
  res.status(StatusCodes.OK).json({ status: "ok" });
});

app.use("/api/v1", apiRouter);

app.use(errorHandler);

export default app;
