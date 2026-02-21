import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./authenticateJwt";

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth?.roles?.includes(role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "forbidden" });
    }
    return next();
  };
}

