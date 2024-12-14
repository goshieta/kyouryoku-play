// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCkl27YvvLqEc2WbHDeMxg26tVatP43XF0",
  authDomain: "kyouryoku-play.firebaseapp.com",
  databaseURL: "https://kyouryoku-play-default-rtdb.firebaseio.com",
  projectId: "kyouryoku-play",
  storageBucket: "kyouryoku-play.appspot.com",
  messagingSenderId: "1063918632710",
  appId: "1:1063918632710:web:d72e53a10cda4f7c722887",
  measurementId: "G-8458LE0ZRL",
};

// Firebaseの初期化処理
if (!getApps()?.length) {
  // Firebaseアプリの初期化
  initializeApp(firebaseConfig);
}

// Initialize Firebase services
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
