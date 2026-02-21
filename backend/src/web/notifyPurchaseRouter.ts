import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { outgoingMessageQueue } from "../services/queueService";
import { getPurchaseTemplate } from "../services/templatesService";
import { AuthenticatedRequest } from "./middlewares/authenticateJwt";

export const notifyPurchaseRouter = Router();

interface NotifyPurchaseBody {
  cliente: string;
  telefone: string;
  mensagem: string;
  pecaId: string;
  valor: number;
}

function normalizePhone(brPhone: string) {
  const digits = brPhone.replace(/\D/g, "");
  if (!digits.startsWith("55")) {
    return `55${digits}`;
  }
  return digits;
}

function applyTemplate(body: NotifyPurchaseBody, template: string) {
  return template
    .replace(/{{cliente}}/g, body.cliente)
    .replace(/{{peca}}/g, body.pecaId)
    .replace(/{{valor}}/g, body.valor.toFixed(2))
    .replace(/{{mensagem}}/g, body.mensagem);
}

notifyPurchaseRouter.post(
  "/notify-purchase",
  async (req: AuthenticatedRequest, res): Promise<void> => {
    const body = req.body as Partial<NotifyPurchaseBody>;

    if (
      !body.cliente ||
      !body.telefone ||
      !body.mensagem ||
      !body.pecaId ||
      typeof body.valor !== "number"
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "cliente, telefone, mensagem, pecaId e valor são obrigatórios",
      });
      return;
    }

    const tenantId = req.auth?.tenantId || "public";
    const template = await getPurchaseTemplate(tenantId);

    const text = applyTemplate(body as NotifyPurchaseBody, template);
    const phone = normalizePhone(body.telefone);

    await outgoingMessageQueue.add(
      {
        phone,
        message: text,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      }
    );

    res.status(StatusCodes.ACCEPTED).json({ status: "queued" });
  }
);
