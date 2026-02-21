"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const http_status_codes_1 = require("http-status-codes");
function requireRole(role) {
    return (req, res, next) => {
        if (!req.auth?.roles?.includes(role)) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({ error: "forbidden" });
        }
        return next();
    };
}
