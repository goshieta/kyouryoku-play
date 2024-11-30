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
            <img
              src={udata.profileImageUrl}
              alt={`${udata.name}の画像`}
              width={100}
              height={100}
              id={styles.profile_img}
            />
          </div>
          <div>
            <p id={styles.greeting}>
              {getGreeting()}！{udata.name}さん。
            </p>
            <div>
              <p>レベル：{calcLankFromPoints(udata.totalPoints)[0]}</p>
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
                ポイントでレベル{calcLankFromPoints(udata.totalPoints)[0] + 1}
                に到達します。
              </p>
            </div>
          </div>
        </div>
        <div id={styles.account_handle}>
          <button>
            <span className="material-symbols-outlined">logout</span>ログアウト
          </button>
          <button>
            <span className="material-symbols-outlined">settings</span>設定
          </button>
          <button>
            <span className="material-symbols-outlined">help</span>ヘルプ
          </button>
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
