"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchaseTemplate = getPurchaseTemplate;
exports.setPurchaseTemplate = setPurchaseTemplate;
const firebaseAdmin_1 = require("../firebase/firebaseAdmin");
async function getPurchaseTemplate(tenantId) {
    const doc = await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(tenantId)
        .collection("settings")
        .doc("templates")
        .get();
    const data = doc.data() || {};
    return (data.purchaseTemplate ||
        process.env.PURCHASE_TEMPLATE ||
        "Olá {{cliente}}, sua compra da peça {{peca}} no valor de R$ {{valor}} foi registrada. {{mensagem}}");
}
async function setPurchaseTemplate(tenantId, template) {
    await firebaseAdmin_1.firestore
        .collection("tenants")
        .doc(tenantId)
        .collection("settings")
        .doc("templates")
        .set({
        purchaseTemplate: template,
        updatedAt: new Date(),
    }, { merge: true });
}
