import { firestore } from "../firebase/firebaseAdmin";

export async function getPurchaseTemplate(tenantId: string) {
  let data: any = {};
  try {
    const doc = await firestore
      .collection("tenants")
      .doc(tenantId)
      .collection("settings")
      .doc("templates")
      .get();
    data = doc.data() || {};
  } catch {
    data = {};
  }
  return (
    data.purchaseTemplate ||
    process.env.PURCHASE_TEMPLATE ||
    "Olá {{cliente}}, sua compra da peça {{peca}} no valor de R$ {{valor}} foi registrada. {{mensagem}}"
  );
}

export async function setPurchaseTemplate(tenantId: string, template: string) {
  await firestore
    .collection("tenants")
    .doc(tenantId)
    .collection("settings")
    .doc("templates")
    .set(
      {
        purchaseTemplate: template,
        updatedAt: new Date(),
      },
      { merge: true }
    );
}
