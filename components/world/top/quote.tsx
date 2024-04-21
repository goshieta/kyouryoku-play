import styles from "@/styles/world/world.module.css";
import { ArticleUser } from "./oneArticle";
import { useEffect, useState } from "react";
import {
  isPubUserDataType,
  isUserType,
  pubUserDataType,
  userType,
} from "@/lib/types/communityType";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import Link from "next/link";

export default function Quote({
  title,
  user,
  body,
  target,
}: {
  title: string;
  user: string;
  body: string;
  target: string;
}) {
  const [userData, setUserData] = useState<pubUserDataType | undefined>(
    undefined
  );
  useEffect(() => {
    getDoc(doc(db, "pubUsers", user))
      .then((oneUser) => oneUser.data())
      .then((userData) => {
        if (isPubUserDataType(userData)) {
          setUserData(userData);
        }
      });
  }, []);

  //リンクなども実装したい
  return (
    <Link id={styles.quote} href={`/world/article/${target}`}>
      {userData ? <ArticleUser userData={userData} /> : <></>}
      <h4>{title}</h4>
      <p>{body}</p>
    </Link>
  );
}
