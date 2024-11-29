"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./style.module.css";
import { loginWithGoogle, loginWithMicrosoft } from "@/app/lib/auth/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const auth = getAuth();
  const [currentUID, setCurrentUID] = useState<null | undefined | string>(null);
  const router = useRouter();

  useEffect(() => {
    const Unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUID(user.uid);
      } else {
        setCurrentUID(undefined);
      }
    });

    return Unsubscribe;
  }, [auth]);

  if (currentUID === null) {
    return <div></div>;
  } else if (currentUID === undefined) {
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
  } else {
    router.push("/account");
    return <p>すでにログインしています</p>;
  }
}
