import admin from "firebase-admin";

if (!admin.apps.length) {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const json = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(json),
    });
  } else {
    admin.initializeApp();
  }
}

export const firestore = admin.firestore();
export const auth = admin.auth();

