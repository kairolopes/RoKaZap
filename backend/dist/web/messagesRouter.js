"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const queueService_1 = require("../services/queueService");
const messageStore_1 = require("../services/messageStore");
const uuid_1 = require("uuid");
exports.messagesRouter = (0, express_1.Router)();
exports.messagesRouter.post("/send", async (req, res) => {
    const { phone, message, ciphertext } = req.body;
    if (!phone || !message) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: "phone and message are required" });
    }
    const auth = req.auth;
    if (!auth) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: "Authentication required" });
    }
    const messageId = (0, uuid_1.v4)();
    const conversationId = phone;
    await (0, messageStore_1.saveMessage)({
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
    await queueService_1.outgoingMessageQueue.add({
        phone,
        message,
    });
    return res.status(http_status_codes_1.StatusCodes.ACCEPTED).json({ status: "queued" });
});
