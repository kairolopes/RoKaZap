import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { registerDeviceToken } from "../services/fcmService";

export const devicesRouter = Router();

devicesRouter.post(
  "/register",
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const token = (req.body as any)?.token as string | undefined;
    if (!req.auth?.userId || !req.auth?.tenantId || !token) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "token inválido" });
      return;
    }
    await registerDeviceToken({
      tenantId: req.auth.tenantId,
      userId: req.auth.userId,
      token,
    });
    res.status(StatusCodes.OK).json({ ok: true });
  }
);

