import { useAuth } from "@/components/context/auth";
import { login, logout } from "@/lib/auth";
import Image from "next/image";
import styles from "@/styles/pages/account.module.css";

export default function Account() {
  const authInfo = useAuth();
  if (!authInfo) {
    return <button onClick={login}>ログイン</button>;
  }

  return (
    <div id={styles.accountPage}>
      <div id={styles.accountInfo}>
        <div id={styles.ai_image_area}>
          <Image
            src={authInfo.photoURL}
            alt="プロフィール画像"
            width={100}
            height={100}
          ></Image>
        </div>
        <div id={styles.ai_desc_area}>
          <h3>{authInfo.name}</h3>
          <p>{authInfo.email}</p>
        </div>
      </div>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
