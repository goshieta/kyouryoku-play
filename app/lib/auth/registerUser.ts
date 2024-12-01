import { db } from "@/app/lib/firebase"; // Firestoreの初期化を行ったファイルをインポート
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestoreのドキュメント操作用
import { UserCredential } from "firebase/auth";

// ユーザー情報をFirestoreに登録する関数
export const registerUser = async (
  userCredential: UserCredential
): Promise<void> => {
  const user = userCredential.user; // UserCredentialからユーザー情報を取得
  const userId = user.uid;

  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    const userName = user.displayName || "名無し"; // アカウント名（表示名がない場合はデフォルト名）
    const userEmail = user.email || ""; // メールアドレス
    const createdAt = new Date(); // アカウントの作成日時

    // Firestoreに保存するデータ
    const userData = {
      id: userId,
      name: userName,
      totalPoints: 0, // 初回ログイン時の合計ポイント
      description: "", // アカウントの説明（必要に応じて追加）
      profileImageUrl: user.photoURL || "/navigation/unknowAccount.png", // アカウント画像のURL
    };
    const privateUserData = {
      createdAt: createdAt,
      email: userEmail,
    };

    try {
      // Firestoreのusersコレクションにユーザー情報を保存
      const userDocRef = doc(db, "users", userId); // ユーザーIDをドキュメントIDとして指定
      const privateUserDocRef = doc(db, "users", userId, "private", "data");
      await setDoc(userDocRef, userData); // データを保存
      await setDoc(privateUserDocRef, privateUserData);
      console.log("ユーザー情報がFirestoreに登録されました:", userData);
    } catch (error) {
      console.error("Firestoreへのユーザー登録エラー:", error);
      throw error; // エラーを再スロー
    }
  }
};
