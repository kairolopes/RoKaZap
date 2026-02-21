"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfReportsRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const pdfkit_1 = __importDefault(require("pdfkit"));
const requireRole_1 = require("./middlewares/requireRole");
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
exports.pdfReportsRouter = (0, express_1.Router)();
exports.pdfReportsRouter.get("/messages.pdf", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    if (!tenantId) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: "unauthorized" });
        return;
    }
    const since = new Date(Date.now() - 7 * 864e5);
    const snap = await firebaseAdmin_1.firestore
        .collectionGroup("messages")
        .where("tenantId", "==", tenantId)
        .where("createdAt", ">=", since)
        .get();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="messages.pdf"');
    const doc = new pdfkit_1.default({ margin: 40 });
    doc.pipe(res);
    doc.fontSize(16).text("Relatório de Mensagens", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Período: desde ${since.toISOString()}`);
    doc.moveDown();
    snap.forEach((d) => {
        const data = d.data();
        doc.text(`${data.createdAt?.toDate?.().toISOString?.() || ""} | ${data.direction?.toUpperCase?.() || ""} | ${data.toPhone || ""} | ${data.fromName || ""}`);
    });
    doc.end();
});
