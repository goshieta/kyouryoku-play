import { db } from "@/lib/firebase/client";
import {
  isPubUserDataType,
  pubUserDataType,
  userType,
} from "@/lib/types/communityType";
import styles from "@/styles/pages/account.module.css";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Following({ userInfo }: { userInfo: userType }) {
  return (
    <div id={styles.following}>
      <h2>フォロー中</h2>
      <div id={styles.followingArea}>
        {userInfo.following.map((oneUserId) => (
          <OneFollowingUser userId={oneUserId} key={oneUserId} />
        ))}
      </div>
    </div>
  );
}

function OneFollowingUser({ userId }: { userId: string }) {
  const [targetUserInfo, setTartgetUserInfo] = useState<
    pubUserDataType | null | undefined
  >(undefined);

  useEffect(() => {
    getDoc(doc(db, "pubUsers", userId))
      .then((data) => data.data())
      .then((data) => {
        if (isPubUserDataType(data)) {
          setTartgetUserInfo(data);
        }
      });
  }, []);

  if (targetUserInfo) {
    return (
      <Link
        className={styles.oneFollowingUser}
        href={`/account/${targetUserInfo.id}`}
      >
        <Image
          src={targetUserInfo.photoURL}
          alt="プロフィール画像"
          width={70}
          height={70}
        />
        <p>{targetUserInfo.name}</p>
      </Link>
    );
  } else {
    return <></>;
  }
}
