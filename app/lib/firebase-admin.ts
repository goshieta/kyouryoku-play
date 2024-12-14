import {
  initializeApp,
  cert,
  App,
  getApps,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth"; // 追加

// Firebase Admin SDKの初期化
let FirebaseAdminApp: App;
if (!getApps().length) {
  const certInfo: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
  };

  FirebaseAdminApp = initializeApp({
    credential: cert(certInfo),
  });
} else {
  FirebaseAdminApp = getApps()[0];
}

export default FirebaseAdminApp;

export const db = getFirestore(FirebaseAdminApp);
export const auth = getAuth(FirebaseAdminApp);
