"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templatesRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const requireRole_1 = require("./middlewares/requireRole");
const templatesService_1 = require("../services/templatesService");
exports.templatesRouter = (0, express_1.Router)();
exports.templatesRouter.get("/purchase", async (req, res) => {
    const tenantId = req.auth?.tenantId || "public";
    const template = await (0, templatesService_1.getPurchaseTemplate)(tenantId);
    res.status(http_status_codes_1.StatusCodes.OK).json({ template });
});
exports.templatesRouter.post("/purchase", (0, requireRole_1.requireRole)("admin"), async (req, res) => {
    const tenantId = req.auth?.tenantId;
    const { template } = req.body;
    if (!tenantId || !template) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "template inválido" });
        return;
    }
    await (0, templatesService_1.setPurchaseTemplate)(tenantId, template);
    res.status(http_status_codes_1.StatusCodes.OK).json({ ok: true });
});
