"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDeviceToken = registerDeviceToken;
exports.sendPushToUser = sendPushToUser;
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
async function registerDeviceToken(args) {
    await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(args.tenantId)
        .collection("users")
        .doc(args.userId)
        .collection("devices")
        .doc(args.token)
        .set({
        token: args.token,
        createdAt: new Date(),
    });
}
async function sendPushToUser(args) {
    const snap = await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(args.tenantId)
        .collection("users")
        .doc(args.userId)
        .collection("devices")
        .get();
    const tokens = snap.docs.map((d) => d.id);
    if (!tokens.length)
        return;
    await firebase_admin_1.default.messaging().sendEachForMulticast({
        tokens,
        notification: {
            title: args.title,
            body: args.body,
        },
    });
}
