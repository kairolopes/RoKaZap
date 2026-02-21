import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { requireRole } from "./middlewares/requireRole";
import { firestore } from "../firebase/firebaseAdmin";

export const kpisRouter = Router();

kpisRouter.get("/summary", requireRole("admin"), async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
  const since = new Date(Date.now() - 7 * 864e5);
  const snap = await firestore
    .collectionGroup("messages")
    .where("tenantId", "==", tenantId)
    .where("createdAt", ">=", since)
    .get();

  let outgoing = 0;
  let incoming = 0;
  snap.forEach((d) => {
    const dir = (d.data() as any).direction;
    if (dir === "outgoing") outgoing++;
    else incoming++;
  });

  res.status(StatusCodes.OK).json({
    since: since.toISOString(),
    outgoing,
    incoming,
    avgResponseMinutes: 0,
    resolutionRate: 0,
  });
});

