import { useAuth } from "@/components/context/auth";
import { login, logout } from "@/lib/auth";
import styles from "@/styles/pages/account.module.css";
import Profile from "@/components/account/profile";
import Post from "@/components/account/post";
import Following from "@/components/account/following";

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
      <button onClick={logout}>ログアウト</button>
      <Following userInfo={authInfo} />
      <Post id={authInfo.id} info={authInfo} />
    </div>
  );
}
