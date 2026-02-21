import crypto from "crypto";
import { firestore } from "../firebase/firebaseAdmin";

interface SaveMessageParams {
  tenantId: string;
  conversationId: string;
  messageId: string;
  fromUserId: string;
  fromName: string;
  toPhone: string;
  content?: string;
  ciphertext?: {
    iv: string;
    authTag: string;
    payload: string;
    keyId: string;
  };
  ip: string;
  direction: "outgoing" | "incoming";
}

export async function saveMessage(params: SaveMessageParams) {
  const timestamp = new Date();
  const hash = crypto
    .createHash("sha256")
    .update(
      [
        params.tenantId,
        params.conversationId,
        params.messageId,
        params.fromUserId,
        params.toPhone,
        params.content || "",
        timestamp.toISOString(),
      ].join("|")
    )
    .digest("hex");

  await firestore
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

export async function updateMessageStatus(args: {
  tenantId: string;
  conversationId: string;
  messageId: string;
  status: string;
}) {
  await firestore
    .collection("tenants")
    .doc(args.tenantId)
    .collection("conversations")
    .doc(args.conversationId)
    .collection("messages")
    .doc(args.messageId)
    .set(
      {
        deliveryStatus: args.status,
        updatedAt: new Date(),
      },
      { merge: true }
    );
}
