import { Router } from "express";
import openapi from "./openapi.json";

export const docsRouter = Router();

docsRouter.get("/openapi.json", (_req, res) => {
  res.json(openapi);
});

