import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { firestore } from "../firebase/firebaseAdmin";

export const usersRouter = Router();

usersRouter.get("/", async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  if (!tenantId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
  }

  const snap = await firestore
    .collection("tenants")
    .doc(tenantId)
    .collection("users")
    .get();

  const items = snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      name: data.name || d.id,
      roles: data.roles || [],
    };
  });

  res.status(StatusCodes.OK).json({ items });
});

