"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesRouter = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const fcmService_1 = require("../services/fcmService");
exports.devicesRouter = (0, express_1.Router)();
exports.devicesRouter.post("/register", async (req, res) => {
    const token = req.body?.token;
    if (!req.auth?.userId || !req.auth?.tenantId || !token) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: "token inválido" });
        return;
    }
    await (0, fcmService_1.registerDeviceToken)({
        tenantId: req.auth.tenantId,
        userId: req.auth.userId,
        token,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ ok: true });
});
