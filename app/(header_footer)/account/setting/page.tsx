"use client";

import useUser from "@/app/lib/auth/useUser";
import styles from "./style.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Setting from "./setting";

export default function AccountSetting() {
  const [uid, uData] = useUser();
  const router = useRouter();

  if (uData) {
    return (
      <div id={styles.setting_page}>
        <h1>アカウントの設定</h1>
        <Setting uData={uData} />
      </div>
    );
  } else if (uData === null) {
    return <div></div>;
  } else if (uData === undefined) {
    router.push("/account/login");
    return (
      <div>
        <p>ログインページへリダイレクトしています…</p>
        <Link href="/account/login">
          自動でリダイレクトされない場合はここをクリック
        </Link>
      </div>
    );
  }
}
