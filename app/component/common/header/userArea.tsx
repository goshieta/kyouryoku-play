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
          <img
            src={userData.profileImageUrl}
            alt={`${userData.name}の画像`}
            id={styles.user_img}
          />
          <div id={styles.user_rank}>
            <p>{userData.rank}</p>
          </div>
        </div>
        <div id={styles.detail_area}>
          <p id={styles.user_name}>{userData.name}</p>
          <p id={styles.user_description}>{userData.description}</p>
          <button>もっと見る</button>
        </div>
      </div>
    );
  } else if (userData === null) {
    //読み込み中
    return (
      <div id={styles.user_area}>
        <div id={styles.img_area}></div>
      </div>
    );
  } else if (userData === undefined) {
    //ログインしていない、もしくはユーザーデータが破損している
    return <button>ログイン</button>;
  }
}
