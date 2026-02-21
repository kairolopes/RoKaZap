"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kpisRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const requireRole_1 = require("./middlewares/requireRole");
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
exports.kpisRouter = (0, express_1.Router)();
exports.kpisRouter.get("/summary", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId)
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
    const since = new Date(Date.now() - 7 * 864e5);
    const snap = await firebaseAdmin_1.firestore
        .collectionGroup("messages")
        .where("tenantId", "==", tenantId)
        .where("createdAt", ">=", since)
        .get();
    let outgoing = 0;
    let incoming = 0;
    snap.forEach((d) => {
        const dir = d.data().direction;
        if (dir === "outgoing")
            outgoing++;
        else
            incoming++;
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        since: since.toISOString(),
        outgoing,
        incoming,
        avgResponseMinutes: 0,
        resolutionRate: 0,
    });
});
