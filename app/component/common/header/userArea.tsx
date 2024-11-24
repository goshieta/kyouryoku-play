import { auth } from "@/app/lib/firebase";
import styles from "./userArea.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { accountDataType } from "@/app/lib/types/accountType";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function UserArea() {
  const [uid, setUid] = useState(auth.currentUser?.uid);
  const [userData, setUserData] = useState<null | undefined | accountDataType>(
    null
  );
  const [onDetailArea, setOnDetailArea] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(undefined);
      }
    });
  }, []);

  const isLoading = useRef(false);
  useEffect(() => {
    if (uid) {
      isLoading.current = true;
      const userDocRef = doc(db, "users", uid);
      (async () => {
        const userdoc = await getDoc(userDocRef);
        const data = userdoc.data() as accountDataType | undefined;
        setUserData(data);
        isLoading.current = false;
      })();
    } else if (!isLoading) {
      setUserData(undefined);
    }
  }, [uid]);

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
            <div id={styles.user_rank}>{userData.rank}</div>
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
            <p>ランク：{userData.rank}</p>
            <div id={styles.progress}>
              <div id={styles.progress_inline}></div>
            </div>
          </div>
          <p id={styles.user_name}>{userData.name}</p>
          <p id={styles.user_description}>{userData.description}</p>
          <button id={styles.show_more}>もっと見る</button>
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
    return <button>ログイン</button>;
  }
}
