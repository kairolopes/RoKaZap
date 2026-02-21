"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = require("../shared/logger");
const messageStore_1 = require("../services/messageStore");
exports.webhookRouter = (0, express_1.Router)();
exports.webhookRouter.post("/zapi/message-status", (req, res) => {
    const signature = req.headers["x-webhook-signature"];
    if (!signature || signature !== process.env.WEBHOOK_SIGNATURE) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
    }
    logger_1.logger.info("Received Z-API webhook", {
        body: req.body,
    });
    // Espera-se que o webhook contenha: tenantId, conversationId (telefone), messageId e status ("SENT","RECEIVED","READ", etc.)
    const { tenantId, conversationId, messageId, status } = req.body || {};
    if (tenantId && conversationId && messageId && status) {
        (0, messageStore_1.updateMessageStatus)({
            tenantId,
            conversationId,
            messageId,
            status,
        }).catch(() => undefined);
    }
    return res.status(http_status_codes_1.StatusCodes.OK).json({ received: true });
});
exports.webhookRouter.post("/parts-system", (req, res) => {
    const signature = req.headers["x-webhook-signature"];
    if (!signature || signature !== process.env.WEBHOOK_SIGNATURE) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
    }
    logger_1.logger.info("Received parts system webhook", {
        body: req.body,
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ received: true });
});
