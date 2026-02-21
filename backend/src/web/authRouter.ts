import { Router } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authRouter = Router();

authRouter.post("/token", (req, res) => {
  const { tenantId, userId, roles } = req.body as {
    tenantId: string;
    userId: string;
    roles: string[];
  };

  if (!tenantId || !userId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "tenantId and userId are required" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "JWT secret not configured" });
  }

  const token = jwt.sign(
    {
      sub: userId,
      tenantId,
      roles: roles || [],
    },
    secret,
    {
      expiresIn: "12h",
    }
  );

  return res.status(StatusCodes.OK).json({ token });
});

