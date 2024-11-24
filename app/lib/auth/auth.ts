import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase"; // Firebaseの初期化を行ったファイルをインポート

// Googleでのログイン関数
export const loginWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider(); // Googleの認証プロバイダーを作成
  try {
    const result = await signInWithPopup(auth, provider); // ポップアップでログインを実行
    return result; // 成功した場合、User  Credentialを返す
  } catch (error) {
    console.error("Googleログインエラー:", error); // エラー処理
    throw error; // エラーを再スロー
  }
};

// Microsoftでのログイン関数
export const loginWithMicrosoft = async (): Promise<UserCredential> => {
  const provider = new OAuthProvider("microsoft.com"); // Microsoftの認証プロバイダーを作成
  try {
    const result = await signInWithPopup(auth, provider); // ポップアップでログインを実行
    return result; // 成功した場合、User  Credentialを返す
  } catch (error) {
    console.error("Microsoftログインエラー:", error); // エラー処理
    throw error; // エラーを再スロー
  }
};
