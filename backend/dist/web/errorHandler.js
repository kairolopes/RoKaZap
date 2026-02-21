"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = require("../shared/logger");
function errorHandler(err, _req, res, _next) {
    logger_1.logger.error("Unhandled error", { err });
    return res
        .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
}
