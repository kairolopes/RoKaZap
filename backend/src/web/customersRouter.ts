import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { firestore } from "../firebase/firebaseAdmin";
import { requireRole } from "./middlewares/requireRole";

export const customersRouter = Router();

customersRouter.get("/", async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) return res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
  const snap = await firestore.collection("tenants").doc(tenantId).collection("customers").get();
  const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  res.status(StatusCodes.OK).json({ items });
});

customersRouter.post("/", async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  const { name, phone, tags, notes } = req.body as {
    name?: string;
    phone?: string;
    tags?: string[];
    notes?: string;
  };
  if (!tenantId || !name || !phone) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
  }
  const doc = await firestore.collection("tenants").doc(tenantId).collection("customers").add({
    name,
    phone,
    tags: tags || [],
    notes: notes || "",
    createdAt: new Date(),
  });
  res.status(StatusCodes.CREATED).json({ id: doc.id });
});

customersRouter.put("/:id", requireRole("admin"), async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  const id = req.params.id;
  const { name, phone, tags, notes } = req.body as any;
  if (!tenantId || !id) return res.status(StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
  await firestore.collection("tenants").doc(tenantId).collection("customers").doc(id).set(
    {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updatedAt: new Date(),
    },
    { merge: true }
  );
  res.status(StatusCodes.OK).json({ ok: true });
});

customersRouter.delete("/:id", requireRole("admin"), async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  const id = req.params.id;
  if (!tenantId || !id) return res.status(StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
  await firestore.collection("tenants").doc(tenantId).collection("customers").doc(id).delete();
  res.status(StatusCodes.NO_CONTENT).send();
});

