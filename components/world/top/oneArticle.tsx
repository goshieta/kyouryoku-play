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
import Reaction from "./reaction";
import Quote from "./quote";

export async function getOneUserInfo(id: string) {
  const document = await getDoc(doc(db, "pubUsers", id));
  const data = document.data();
  if (isPubUserDataType(data)) return data;
  else return undefined;
}

export function ArticleUser({
  userData,
  createdAt,
}: {
  userData: pubUserDataType;
  createdAt?: Date;
}) {
  const zeroPadding = (digit: number, num: number) =>
    ("0".repeat(digit) + num.toString()).slice(-digit);
  return (
    <div className={styles.accountArea}>
      <Link href={`/account/${userData.id}`}>
        <Image
          src={userData.photoURL}
          width={25}
          height={25}
          alt={userData.name}
        />
        <p>{userData.name}</p>
      </Link>
      {createdAt ? (
        <p>{`${createdAt.getFullYear()}年${
          createdAt.getMonth() + 1
        }月${createdAt.getDate()}日 ${zeroPadding(
          2,
          createdAt.getHours()
        )}:${zeroPadding(2, createdAt.getMinutes())}`}</p>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function OneArticle({
  article,
  usersInfo,
  setUsersInfo,
  isNoQuote,
  isTileMode,
}: {
  article: oneArticleType;
  usersInfo: { [key: string]: pubUserDataType };
  setUsersInfo: (newUsersInfo: { [key: string]: pubUserDataType }) => void;
  isNoQuote?: boolean;
  isTileMode?: boolean;
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

  return (
    <div
      className={`${styles.oneArticle} ${isTileMode ? styles.tileMode : ""}`}
    >
      {userData ? (
        <ArticleUser userData={userData} createdAt={createdAt} />
      ) : (
        <></>
      )}
      {article.type === "article" && (
        <Link
          href={`/world/article/${article.id}`}
          className={styles.oneArticleLink}
        >
          <h3>{article.title}</h3>
        </Link>
      )}
      {article.type === "reply" && !isNoQuote ? (
        <Quote
          title={article.targetTitle!}
          body={article.targetBody!}
          user={article.targetUser!}
          target={article.target!}
        />
      ) : (
        <></>
      )}
      <Link
        href={`/world/article/${article.id}`}
        className={styles.oneArticleLink}
      >
        <p className={styles.articleBody}>{article.body}</p>
      </Link>
      <div className={styles.tagArea}>
        {article.tags.map((oneTag) => (
          <Link key={oneTag} href={`/world?q=${oneTag}`}>
            #{oneTag}
          </Link>
        ))}
      </div>
      <Reaction
        like={article.like}
        dislike={article.dislike}
        reply={article.reply}
        messageId={article.id}
      />
    </div>
  );
}
