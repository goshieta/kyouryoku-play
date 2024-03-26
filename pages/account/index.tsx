import { useAuth } from "@/components/context/auth";
import { login, logout } from "@/lib/auth";
import styles from "@/styles/pages/account.module.css";
import Profile from "@/components/account/profile";

export default function Account() {
  const authInfo = useAuth();
  if (!authInfo) {
    return (
      <button
        onClick={login}
        style={{ margin: "100px auto", display: "block" }}
      >
        ログイン
      </button>
    );
  }

  return (
    <div id={styles.accountPage}>
      <Profile authInfo={authInfo}></Profile>
      <div id={styles.communityTip}></div>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
