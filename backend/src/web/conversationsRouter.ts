import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { requireRole } from "./middlewares/requireRole";
import { firestore } from "../firebase/firebaseAdmin";
import { sendPushToUser } from "../services/fcmService";

export const conversationsRouter = Router();

conversationsRouter.post(
  "/:id/transfer",
  requireRole("admin"),
  async (req: AuthenticatedRequest, res) => {
    const tenantId = req.auth?.tenantId;
    const id = req.params.id;
    const { assigneeUserId } = req.body as { assigneeUserId?: string };
    if (!tenantId || !id || !assigneeUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
    }

    await firestore
      .collection("tenants")
      .doc(tenantId)
      .collection("conversations")
      .doc(id)
      .set(
        {
          assigneeUserId,
          updatedAt: new Date(),
        },
        { merge: true }
      );

    await sendPushToUser({
      tenantId,
      userId: assigneeUserId,
      title: "Nova conversa atribuída",
      body: `Você recebeu a conversa ${id}`,
    });

    return res.status(StatusCodes.OK).json({ ok: true });
  }
);

conversationsRouter.post("/:id/group", requireRole("admin"), async (req: AuthenticatedRequest, res) => {
  const tenantId = req.auth?.tenantId;
  const id = req.params.id;
  const { groupId } = req.body as { groupId?: string };
  if (!tenantId || !id || !groupId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
  }

  await firestore
    .collection("tenants")
    .doc(tenantId)
    .collection("conversations")
    .doc(id)
    .set(
      {
        groupId,
        updatedAt: new Date(),
      },
      { merge: true }
    );

  return res.status(StatusCodes.OK).json({ ok: true });
});

