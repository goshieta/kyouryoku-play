"use client";

import styles from "./style.module.css";
import { loginWithGoogle, loginWithMicrosoft } from "@/app/lib/auth/auth";

export default function Login() {
  return (
    <div id={styles.login}>
      <div id={styles.login_ui}>
        <h1>峡緑プレイにログイン</h1>
        <div id={styles.button_area}>
          <button onClick={loginWithGoogle}>
            <img
              src="/navigation/logo/google.png"
              alt="Google"
              width={30}
              height={30}
            />
            <p>Googleでログイン</p>
          </button>
          <button onClick={loginWithMicrosoft}>
            <img
              src="/navigation/logo/microsoft.png"
              alt="Microsoft"
              width={30}
              height={30}
            />
            <p>Microsoftでログイン</p>
          </button>
        </div>
      </div>
    </div>
  );
}
