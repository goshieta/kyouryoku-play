"use client";

import useUser from "@/app/lib/auth/useUser";
import styles from "./style.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountSetting() {
  const [uid, uData] = useUser();
  const router = useRouter();

  if (uData) {
    return (
      <div id={styles.setting_page}>
        <h1>アカウントの設定</h1>
        <form>
          <div id={styles.setting_area}>
            <div>
              <img src={uData.profileImageUrl} alt={`${uData.name}の画像`} />
              <button>変更</button>
            </div>
            <div>
              <p>アカウント名</p>
              <input
                type="text"
                value={uData.name}
                placeholder="アカウント名を入力"
              />
            </div>
            <div>
              <p>アカウントの説明</p>
              <textarea
                value={uData.description}
                placeholder="アカウントの説明を入力"
              />
            </div>
          </div>
          <div id={styles.applyArea}>
            <button>キャンセル</button>
            <button>適用</button>
          </div>
        </form>
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
