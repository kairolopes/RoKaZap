"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = authenticateJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
function authenticateJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: "Missing bearer token" });
    }
    const token = authHeader.substring("Bearer ".length);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "JWT secret not configured" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.auth = {
            userId: payload.sub,
            tenantId: payload.tenantId,
            roles: payload.roles || [],
        };
        return next();
    }
    catch {
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ error: "Invalid or expired token" });
    }
}
