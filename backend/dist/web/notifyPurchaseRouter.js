"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyPurchaseRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const queueService_1 = require("../services/queueService");
const templatesService_1 = require("../services/templatesService");
exports.notifyPurchaseRouter = (0, express_1.Router)();
function normalizePhone(brPhone) {
    const digits = brPhone.replace(/\D/g, "");
    if (!digits.startsWith("55")) {
        return `55${digits}`;
    }
    return digits;
}
function applyTemplate(body, template) {
    return template
        .replace(/{{cliente}}/g, body.cliente)
        .replace(/{{peca}}/g, body.pecaId)
        .replace(/{{valor}}/g, body.valor.toFixed(2))
        .replace(/{{mensagem}}/g, body.mensagem);
}
exports.notifyPurchaseRouter.post("/notify-purchase", async (req, res) => {
    const body = req.body;
    if (!body.cliente ||
        !body.telefone ||
        !body.mensagem ||
        !body.pecaId ||
        typeof body.valor !== "number") {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            error: "cliente, telefone, mensagem, pecaId e valor são obrigatórios",
        });
        return;
    }
    const tenantId = req.auth?.tenantId || "public";
    const template = await (0, templatesService_1.getPurchaseTemplate)(tenantId);
    const text = applyTemplate(body, template);
    const phone = normalizePhone(body.telefone);
    await queueService_1.outgoingMessageQueue.add({
        phone,
        message: text,
    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    });
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({ status: "queued" });
});
