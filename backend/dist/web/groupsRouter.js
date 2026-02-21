"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupsRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const requireRole_1 = require("./middlewares/requireRole");
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
exports.groupsRouter = (0, express_1.Router)();
exports.groupsRouter.get("/", async (req, res) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId)
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
    const snap = await firebaseAdmin_1.firestore.collection("tenants").doc(tenantId).collection("groups").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.status(http_status_codes_1.StatusCodes.OK).json({ items });
});
exports.groupsRouter.post("/", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    const { name } = req.body;
    if (!tenantId || !name)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "nome inválido" });
    const doc = await firebaseAdmin_1.firestore.collection("tenants").doc(tenantId).collection("groups").add({
        name,
        createdAt: new Date(),
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ id: doc.id });
});
