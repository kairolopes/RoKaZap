import { firestore } from "../firebase/firebaseAdmin";
import admin from "firebase-admin";

export async function registerDeviceToken(args: {
  tenantId: string;
  userId: string;
  token: string;
}) {
  await firestore
    .collection("tenants")
    .doc(args.tenantId)
    .collection("users")
    .doc(args.userId)
    .set(
      {
        name: args.userId,
        updatedAt: new Date(),
      },
      { merge: true }
    );

  await firestore
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

export async function sendPushToUser(args: {
  tenantId: string;
  userId: string;
  title: string;
  body: string;
}) {
  const snap = await firestore
    .collection("tenants")
    .doc(args.tenantId)
    .collection("users")
    .doc(args.userId)
    .collection("devices")
    .get();

  const tokens = snap.docs.map((d) => d.id);
  if (!tokens.length) return;

  await admin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title: args.title,
      body: args.body,
    },
  });
}
