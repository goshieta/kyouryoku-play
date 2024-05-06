import Image from "next/image";
import { useAuth } from "../context/auth";
import styles from "@/styles/page.module.css";

export default function AccountArea() {
  const authInfo = useAuth();

  return (
    <div id={styles.summaryAccountArea}>
      {authInfo ? (
        <div>
          <Image
            src={authInfo.photoURL}
            alt="プロフィール画像"
            width={30}
            height={30}
          />
          <p>ようこそ、{authInfo.name}さん！</p>
        </div>
      ) : authInfo === undefined ? (
        <div>読み込み中...</div>
      ) : (
        <div>
          <button>サインアップ</button>
          <button>ログイン</button>
        </div>
      )}
    </div>
  );
}
