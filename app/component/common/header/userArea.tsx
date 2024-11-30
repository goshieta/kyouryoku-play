import { auth } from "@/app/lib/firebase";
import styles from "./userArea.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { accountDataType } from "@/app/lib/types/accountType";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import calcLankFromPoints from "@/app/lib/tips/calcLankFromPoints";
import CircularProgressBar from "./progress";
import { useRouter } from "next/navigation";
import useUser from "@/app/lib/auth/useUser";

export default function UserArea() {
  const [uid, userData] = useUser();
  const [onDetailArea, setOnDetailArea] = useState(false);

  const router = useRouter();
  const handleShowMore = useCallback(() => {
    router.push("/account");
    setOnDetailArea(false);
  }, [router]);

  if (userData) {
    return (
      <div id={styles.user_area}>
        <div id={styles.img_area}>
          <button
            id={styles.account_button}
            onClick={() => setOnDetailArea(!onDetailArea)}
          >
            <img
              src={userData.profileImageUrl}
              alt={`${userData.name}の画像`}
              id={styles.user_img}
              width={36}
              height={36}
            />
            <div id={styles.user_rank}>
              {calcLankFromPoints(userData.totalPoints)[0]}
            </div>
            <div id={styles.circleProgress}>
              <CircularProgressBar
                percentage={
                  (calcLankFromPoints(userData.totalPoints)[1] /
                    calcLankFromPoints(userData.totalPoints)[2]) *
                  100
                }
              />
            </div>
          </button>
        </div>
        <div
          id={styles.detail_area}
          style={{ display: onDetailArea ? "block" : "none" }}
        >
          <img
            src={userData.profileImageUrl}
            alt={`${userData.name}の画像`}
            width={60}
            height={60}
            id={styles.profile_detail_img}
          />
          <div id={styles.rank_area}>
            <p>ランク：{calcLankFromPoints(userData.totalPoints)[0]}</p>
            <div id={styles.progress}>
              <div
                id={styles.progress_inline}
                style={{
                  width: `${
                    (calcLankFromPoints(userData.totalPoints)[1] /
                      calcLankFromPoints(userData.totalPoints)[2]) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <p id={styles.user_name}>{userData.name}</p>
          <p id={styles.user_description}>{userData.description}</p>
          <button id={styles.show_more} onClick={handleShowMore}>
            もっと見る
          </button>
        </div>
      </div>
    );
  } else if (userData === null) {
    //読み込み中
    return (
      <div id={styles.user_area}>
        <div id={styles.img_area}>
          <div id={styles.loading_damy}></div>
        </div>
      </div>
    );
  } else if (userData === undefined) {
    //ログインしていない、もしくはユーザーデータが破損している
    return (
      <button id={styles.login} onClick={() => router.push("/account/login")}>
        <span className="material-symbols-outlined">login</span>ログイン
      </button>
    );
  }
}
