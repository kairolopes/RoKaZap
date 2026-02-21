import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    tenantId: string;
    roles: string[];
  };
}

export function authenticateJwt(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Missing bearer token" });
  }

  const token = authHeader.substring("Bearer ".length);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "JWT secret not configured" });
  }

  try {
    const payload = jwt.verify(token, secret) as {
      sub: string;
      tenantId: string;
      roles?: string[];
    };

    req.auth = {
      userId: payload.sub,
      tenantId: payload.tenantId,
      roles: payload.roles || [],
    };

    return next();
  } catch {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid or expired token" });
  }
}

