import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { requireRole } from "./middlewares/requireRole";
import { firestore } from "../firebase/firebaseAdmin";

export const reportsRouter = Router();

reportsRouter.get(
  "/messages.csv",
  requireRole("admin"),
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
      return;
    }
    const { start, end, phone, agent } = req.query as Record<string, string>;
    const startDate = start ? new Date(start) : new Date(Date.now() - 7 * 864e5);
    const endDate = end ? new Date(end) : new Date();

    let q = firestore
      .collectionGroup("messages")
      .where("tenantId", "==", tenantId)
      .where("createdAt", ">=", startDate)
      .where("createdAt", "<=", endDate);

    if (phone) {
      q = q.where("toPhone", "==", phone);
    }
    if (agent) {
      q = q.where("fromUserId", "==", agent);
    }

    const snap = await q.get();

    const rows: string = [
      ["createdAt", "toPhone", "fromUserId", "fromName", "direction", "status"].join(","),
      ...snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => {
        const data: any = d.data();
        return [
          data.createdAt?.toDate?.().toISOString?.() || "",
          data.toPhone || "",
          data.fromUserId || "",
          data.fromName || "",
          data.direction || "",
          data.deliveryStatus || "",
        ].join(",");
      }),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=\"messages.csv\"");
    res.status(StatusCodes.OK).send(rows);
  }
);
