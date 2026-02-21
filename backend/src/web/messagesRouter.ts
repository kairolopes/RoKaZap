import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";
import { outgoingMessageQueue } from "../services/queueService";
import { saveMessage } from "../services/messageStore";
import { v4 as uuid } from "uuid";

export const messagesRouter = Router();

messagesRouter.post("/send", async (req: AuthenticatedRequest, res) => {
  const { phone, message, ciphertext } = req.body as {
    phone: string;
    message: string;
    ciphertext?: {
      iv: string;
      authTag: string;
      payload: string;
      keyId: string;
    };
  };

  if (!phone || !message) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "phone and message are required" });
  }

  const auth = req.auth;
  if (!auth) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authentication required" });
  }

  const messageId = uuid();
  const conversationId = phone;

  await saveMessage({
    tenantId: auth.tenantId,
    conversationId,
    messageId,
    fromUserId: auth.userId,
    fromName: req.headers["x-user-name"]?.toString() || "unknown",
    toPhone: phone,
    content: ciphertext ? undefined : message,
    ciphertext,
    ip: req.ip || "",
    direction: "outgoing",
  });

  await outgoingMessageQueue.add({
    phone,
    message,
  });

  return res.status(StatusCodes.ACCEPTED).json({ status: "queued" });
});
