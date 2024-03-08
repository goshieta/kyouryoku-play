import { initializeApp, getApps } from "firebase/app";

// 必要な機能をインポート
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  // TODO:認証情報を設置
  apiKey: "AIzaSyCkl27YvvLqEc2WbHDeMxg26tVatP43XF0",
  authDomain: "kyouryoku-play.firebaseapp.com",
  projectId: "kyouryoku-play",
  storageBucket: "kyouryoku-play.appspot.com",
  messagingSenderId: "1063918632710",
  appId: "1:1063918632710:web:d72e53a10cda4f7c722887",
  measurementId: "G-8458LE0ZRL",
};

if (!getApps()?.length) {
  // Firebaseアプリの初期化
  initializeApp(firebaseConfig);
}

// 他ファイルで使うために機能をエクスポート
//ssrが原因のエラーが出るためいったんgoogleAnalyticsは停止
//export const analytics = getAnalytics();
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
export const funcions = getFunctions();
