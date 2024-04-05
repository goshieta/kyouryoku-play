import { db } from "@/lib/firebase/client";
import {
  isPubUserDataType,
  oneArticleType,
  pubUserDataType,
} from "@/lib/types/communityType";
import styles from "@/styles/world/world.module.css";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export async function getOneUserInfo(id: string) {
  const document = await getDoc(doc(db, "pubUsers", id));
  const data = document.data();
  if (isPubUserDataType(data)) return data;
  else return undefined;
}

export default function OneArticle({
  article,
  usersInfo,
  setUsersInfo,
}: {
  article: oneArticleType;
  usersInfo: { [key: string]: pubUserDataType };
  setUsersInfo: (newUsersInfo: { [key: string]: pubUserDataType }) => void;
}) {
  //ユーザーのデータを設定
  const [userData, setUserData] = useState<pubUserDataType | null | undefined>(
    usersInfo[article.user] ? usersInfo[article.user] : null
  );
  useEffect(() => {
    if (userData === null) {
      getOneUserInfo(article.user).then((data) => {
        setUserData(data);
        if (data) {
          setUsersInfo({ ...usersInfo, [article.user]: data });
        }
        return true;
      });
    }
  }, [usersInfo]);
  const createdAt = useMemo(() => new Date(article.createdAt), []);
  const zeroPadding = (digit: number, num: number) =>
    ("0".repeat(digit) + num.toString()).slice(-digit);

  return (
    <div className={styles.oneArticle}>
      {userData ? (
        <div className={styles.accountArea}>
          <Image
            src={userData.photoURL}
            width={25}
            height={25}
            alt={userData.name}
          />
          <p>{userData.name}</p>
          <p>{`${createdAt.getFullYear()}年${
            createdAt.getMonth() + 1
          }月${createdAt.getDate()}日 ${zeroPadding(
            2,
            createdAt.getHours()
          )}:${zeroPadding(2, createdAt.getMinutes())}`}</p>
        </div>
      ) : (
        <></>
      )}
      <h3>{article.title}</h3>
      <p>{article.body}</p>
      <div className={styles.tagArea}>
        {article.tags.map((oneTag) => (
          <Link key={oneTag} href={`http://localhost:3000/world?q=${oneTag}`}>
            #{oneTag}
          </Link>
        ))}
      </div>
    </div>
  );
}
