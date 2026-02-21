import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../shared/logger";
import { updateMessageStatus } from "../services/messageStore";
import { firestore } from "../firebase/firebaseAdmin";

export const webhookRouter = Router();

webhookRouter.post("/zapi/message-status", (req, res) => {
  const signature = req.headers["x-webhook-signature"];
  if (!signature || signature !== process.env.WEBHOOK_SIGNATURE) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
  }

  logger.info("Received Z-API webhook", {
    body: req.body,
  });

  // Espera-se que o webhook contenha: tenantId, conversationId (telefone), messageId e status ("SENT","RECEIVED","READ", etc.)
  const { tenantId, conversationId, messageId, status } = req.body || {};
  if (tenantId && conversationId && messageId && status) {
    updateMessageStatus({
      tenantId,
      conversationId,
      messageId,
      status,
    }).catch(() => undefined);
  }

  return res.status(StatusCodes.OK).json({ received: true });
});

webhookRouter.post("/parts-system", (req, res) => {
  const signature = req.headers["x-webhook-signature"];
  if (!signature || signature !== process.env.WEBHOOK_SIGNATURE) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
  }

  logger.info("Received parts system webhook", {
    body: req.body,
  });

  return res.status(StatusCodes.OK).json({ received: true });
});
