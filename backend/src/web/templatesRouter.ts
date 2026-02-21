import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { requireRole } from "./middlewares/requireRole";
import {
  getPurchaseTemplate,
  setPurchaseTemplate,
} from "../services/templatesService";

export const templatesRouter = Router();

templatesRouter.get(
  "/purchase",
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const tenantId = req.auth?.tenantId || "public";
    const template = await getPurchaseTemplate(tenantId);
    res.status(StatusCodes.OK).json({ template });
  }
);

templatesRouter.post(
  "/purchase",
  requireRole("admin"),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const tenantId = req.auth?.tenantId;
    const { template } = req.body as { template?: string };
    if (!tenantId || !template) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "template inválido" });
      return;
    }
    await setPurchaseTemplate(tenantId, template);
    res.status(StatusCodes.OK).json({ ok: true });
  }
);

