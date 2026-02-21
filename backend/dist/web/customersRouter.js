"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
const requireRole_1 = require("./middlewares/requireRole");
exports.customersRouter = (0, express_1.Router)();
exports.customersRouter.get("/", async (req, res) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId)
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
    const snap = await firebaseAdmin_1.firestore.collection("tenants").doc(tenantId).collection("customers").get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.status(http_status_codes_1.StatusCodes.OK).json({ items });
});
exports.customersRouter.post("/", async (req, res) => {
    const tenantId = req.auth?.tenantId;
    const { name, phone, tags, notes } = req.body;
    if (!tenantId || !name || !phone) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
    }
    const doc = await firebaseAdmin_1.firestore.collection("tenants").doc(tenantId).collection("customers").add({
        name,
        phone,
        tags: tags || [],
        notes: notes || "",
        createdAt: new Date(),
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ id: doc.id });
});
exports.customersRouter.put("/:id", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    const id = req.params.id;
    const { name, phone, tags, notes } = req.body;
    if (!tenantId || !id)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
    await firebaseAdmin_1.firestore.collection("tenants").doc(tenantId).collection("customers").doc(id).set({
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(tags !== undefined ? { tags } : {}),
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date(),
    }, { merge: true });
    res.status(http_status_codes_1.StatusCodes.OK).json({ ok: true });
});
exports.customersRouter.delete("/:id", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    const id = req.params.id;
    if (!tenantId || !id)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "dados inválidos" });
    await firebaseAdmin_1.firestore.collection("tenants").doc(tenantId).collection("customers").doc(id).delete();
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
});
