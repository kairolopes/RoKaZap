import rateLimit from "express-rate-limit";
import { AuthenticatedRequest } from "./authenticateJwt";

export const rateLimitByTenant = rateLimit({
  windowMs: 60 * 1000,
  max: (_req: AuthenticatedRequest) => {
    return 120;
  },
  keyGenerator: (req: AuthenticatedRequest) => {
    return (req.auth?.tenantId || req.ip || "anonymous") as string;
  },
  standardHeaders: true,
  legacyHeaders: false,
});
