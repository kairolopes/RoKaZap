"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outgoingMessageQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const logger_1 = require("../shared/logger");
const zapiService_1 = require("./zapiService");
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
exports.outgoingMessageQueue = new bull_1.default("outgoing-messages", redisUrl);
exports.outgoingMessageQueue.process(async (job) => {
    await (0, zapiService_1.sendTextMessage)(job.data);
});
exports.outgoingMessageQueue.on("failed", (job, err) => {
    logger_1.logger.error("Outgoing message failed", {
        jobId: job.id,
        err,
    });
});
