"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/token", (req, res) => {
    const { tenantId, userId, roles } = req.body;
    if (!tenantId || !userId) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ error: "tenantId and userId are required" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "JWT secret not configured" });
    }
    const token = jsonwebtoken_1.default.sign({
        sub: userId,
        tenantId,
        roles: roles || [],
    }, secret, {
        expiresIn: "12h",
    });
    return res.status(http_status_codes_1.StatusCodes.OK).json({ token });
});
