"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessage = saveMessage;
exports.updateMessageStatus = updateMessageStatus;
const crypto_1 = __importDefault(require("crypto"));
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
async function saveMessage(params) {
    const timestamp = new Date();
    const hash = crypto_1.default
        .createHash("sha256")
        .update([
        params.tenantId,
        params.conversationId,
        params.messageId,
        params.fromUserId,
        params.toPhone,
        params.content || "",
        timestamp.toISOString(),
    ].join("|"))
        .digest("hex");
    await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(params.tenantId)
        .collection("conversations")
        .doc(params.conversationId)
        .collection("messages")
        .doc(params.messageId)
        .set({
        tenantId: params.tenantId,
        conversationId: params.conversationId,
        content: params.content ? null : undefined,
        ciphertext: params.ciphertext || null,
        toPhone: params.toPhone,
        fromUserId: params.fromUserId,
        fromName: params.fromName,
        direction: params.direction,
        createdAt: timestamp,
        deliveryStatus: "QUEUED",
        signature: {
            timestamp: timestamp.toISOString(),
            ip: params.ip,
            hash,
        },
    });
}
async function updateMessageStatus(args) {
    await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(args.tenantId)
        .collection("conversations")
        .doc(args.conversationId)
        .collection("messages")
        .doc(args.messageId)
        .set({
        deliveryStatus: args.status,
        updatedAt: new Date(),
    }, { merge: true });
}
