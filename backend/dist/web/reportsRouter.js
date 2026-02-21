"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const requireRole_1 = require("./middlewares/requireRole");
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
exports.reportsRouter = (0, express_1.Router)();
exports.reportsRouter.get("/messages.csv", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
        return;
    }
    const { start, end, phone, agent } = req.query;
    const startDate = start ? new Date(start) : new Date(Date.now() - 7 * 864e5);
    const endDate = end ? new Date(end) : new Date();
    let q = firebaseAdmin_1.firestore
        .collectionGroup("messages")
        .where("tenantId", "==", tenantId)
        .where("createdAt", ">=", startDate)
        .where("createdAt", "<=", endDate);
    if (phone) {
        q = q.where("toPhone", "==", phone);
    }
    if (agent) {
        q = q.where("fromUserId", "==", agent);
    }
    const snap = await q.get();
    const rows = [
        ["createdAt", "toPhone", "fromUserId", "fromName", "direction", "status"].join(","),
        ...snap.docs.map((d) => {
            const data = d.data();
            return [
                data.createdAt?.toDate?.().toISOString?.() || "",
                data.toPhone || "",
                data.fromUserId || "",
                data.fromName || "",
                data.direction || "",
                data.deliveryStatus || "",
            ].join(",");
        }),
    ].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=\"messages.csv\"");
    res.status(http_status_codes_1.StatusCodes.OK).send(rows);
});
