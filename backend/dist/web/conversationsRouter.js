"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationsRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const requireRole_1 = require("./middlewares/requireRole");
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
const fcmService_1 = require("../services/fcmService");
exports.conversationsRouter = (0, express_1.Router)();
exports.conversationsRouter.post("/:id/transfer", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    const id = req.params.id;
    const { assigneeUserId } = req.body;
    if (!tenantId || !id || !assigneeUserId) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
    }
    await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(tenantId)
        .collection("conversations")
        .doc(id)
        .set({
        assigneeUserId,
        updatedAt: new Date(),
    }, { merge: true });
    await (0, fcmService_1.sendPushToUser)({
        tenantId,
        userId: assigneeUserId,
        title: "Nova conversa atribuída",
        body: `Você recebeu a conversa ${id}`,
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ ok: true });
});
exports.conversationsRouter.post("/:id/group", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    const id = req.params.id;
    const { groupId } = req.body;
    if (!tenantId || !id || !groupId) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
    }
    await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(tenantId)
        .collection("conversations")
        .doc(id)
        .set({
        groupId,
        updatedAt: new Date(),
    }, { merge: true });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ ok: true });
});
