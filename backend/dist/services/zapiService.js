"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextMessage = sendTextMessage;
const axios_1 = __importDefault(require("axios"));
const baseURL = process.env.ZAPI_BASE_URL;
const instanceToken = process.env.ZAPI_INSTANCE_TOKEN;
if (!baseURL || !instanceToken) {
    // No throw here to allow building without env vars; runtime calls will fail fast
}
async function sendTextMessage(payload) {
    if (!baseURL || !instanceToken) {
        throw new Error("Z-API configuration is missing");
    }
    await axios_1.default.post(`${baseURL}/instances/${instanceToken}/token/send-text`, {
        phone: payload.phone,
        message: payload.message,
    });
}
