"use client";

import Link from "next/link";
import useUser from "../lib/auth/useUser";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import getGreeting from "../lib/tips/getGreeting";
import calcLankFromPoints from "../lib/tips/calcLankFromPoints";

export default function AccountPage() {
  const [uid, udata] = useUser();
  const router = useRouter();

  if (udata) {
    return (
      <div id={styles.account_page}>
        <div id={styles.top_profile}>
          <div>
            <img src={udata.profileImageUrl} alt={`${udata.name}の画像`} />
          </div>
          <div>
            <p>
              {getGreeting()}！{udata.name}さん。
            </p>
            <div>
              <p>レベル：{calcLankFromPoints(udata.totalPoints)[0]}</p>
              <p>総獲得ポイント：{udata.totalPoints}</p>
              <div id={styles.point_bar}>
                <div
                  style={{
                    width: `${
                      (calcLankFromPoints(udata.totalPoints)[1] /
                        calcLankFromPoints(udata.totalPoints)[2]) *
                      100
                    }%`,
                  }}
                  id={styles.point_bar_inline}
                ></div>
              </div>
              <p>
                あと、
                {calcLankFromPoints(udata.totalPoints)[2] -
                  calcLankFromPoints(udata.totalPoints)[1]}
                ポイントで次のレベルに到達します。
              </p>
            </div>
          </div>
        </div>
        <div id={styles.account_handle}>
          <button>ログアウト</button>
          <button>設定</button>
          <button>アカウントについて</button>
          <button>レベルとポイントについて</button>
        </div>
      </div>
    );
  } else if (udata === null) {
    return <div></div>;
  } else if (udata === undefined) {
    router.push("/account/login");
    return (
      <div>
        <p>ログインページにリダイレクト中…</p>
        <Link href="/account/login">リダイレクトされない場合はクリック</Link>
      </div>
    );
  }
}
