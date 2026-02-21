import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { requireRole } from "./middlewares/requireRole";
import { firestore } from "../firebase/firebaseAdmin";

export const groupsRouter = Router();

groupsRouter.get("/", async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
  const snap = await firestore.collection("tenants").doc(tenantId).collection("groups").get();
  const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  res.status(StatusCodes.OK).json({ items });
});

groupsRouter.post("/", requireRole("admin"), async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  const { name } = req.body as { name?: string };
  if (!tenantId || !name) return res.status(StatusCodes.BAD_REQUEST).json({ error: "nome inválido" });
  const doc = await firestore.collection("tenants").doc(tenantId).collection("groups").add({
    name,
    createdAt: new Date(),
  });
  res.status(StatusCodes.CREATED).json({ id: doc.id });
});

