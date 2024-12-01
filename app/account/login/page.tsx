"use client";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./style.module.css";
import { loginWithGoogle } from "@/app/lib/auth/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KyouRyoukuPlay from "@/app/component/common/header/kyouryokuPlay";
import Link from "next/link";
import Image from "next/image";

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

  useEffect(() => {
    if (currentUID) {
      router.push("/account");
    }
  });

  if (currentUID === null) {
    return <div></div>;
  } else if (currentUID === undefined) {
    return (
      <div id={styles.login}>
        <div id={styles.login_ui}>
          <p id={styles.title}>Login</p>
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
          </div>
          <div id={styles.kyouryoku}>
            <Link href="/" id={styles.kyouryoku_play}>
              <div>
                <Image
                  src="/icon.png"
                  alt="峡緑プレイ"
                  width={35}
                  height={35}
                />
              </div>
              <div>
                <p>KyouRyoku Play</p>
                <h1>峡緑プレイ</h1>
              </div>
            </Link>
            <p id={styles.credit}>©2024 KyouRyoku</p>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>すでにログインしています</p>;
  }
}
