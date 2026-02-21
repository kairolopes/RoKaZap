"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.firestore = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
if (!firebase_admin_1.default.apps.length) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        const json = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(json),
        });
    }
    else {
        firebase_admin_1.default.initializeApp();
    }
}
exports.firestore = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
