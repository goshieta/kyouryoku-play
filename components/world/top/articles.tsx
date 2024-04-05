import { db } from "@/lib/firebase/client";
import {
  isOneArticleType,
  oneArticleType,
  pubUserDataType,
} from "@/lib/types/communityType";
import styles from "@/styles/world/world.module.css";
import {
  QueryDocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import OneArticle, { getOneUserInfo } from "./oneArticle";
import { DocumentData } from "firebase-admin/firestore";

export default function Articles({ query }: { query: string | null }) {
  const [arts, setArts] = useState<oneArticleType[] | undefined>(undefined);
  const [artSnapshots, setArtsSnapShots] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [usersInfo, setUsersInfo] = useState<
    { [key: string]: pubUserDataType } | undefined
  >(undefined);

  useEffect(() => {
    //記事を取得
    const queryEffect = async () => {
      const articles = await getArticleFromQuery(query);
      if (articles) setArtsSnapShots(articles);
    };
    queryEffect();
  }, [query]);

  useEffect(() => {
    const newArts: oneArticleType[] = [];
    artSnapshots.forEach((oneSnapshot) => {
      const data = oneSnapshot.data();
      if (isOneArticleType(data)) newArts.push(data);
    });
    setArts(newArts);
  }, [artSnapshots]);

  //通信量を抑えるためにここでユーザーデータを最初に取得する
  useEffect(() => {
    const getUsersInfo = async () => {
      if (!arts) return;
      if (!usersInfo) {
        let newUsers: { [key: string]: pubUserDataType } = {};
        for (const oneMessage of arts) {
          const localUserInfo = newUsers[oneMessage.user];
          if (localUserInfo === undefined) {
            const user = await getOneUserInfo(oneMessage.user);
            if (user) newUsers = { ...newUsers, [oneMessage.user]: user };
          }
        }
        setUsersInfo(newUsers);
      }
    };
    getUsersInfo();
  }, [arts]);

  return (
    <div id={styles.articles}>
      {usersInfo ? (
        arts?.map((oneArts) => (
          <OneArticle
            article={oneArts}
            key={oneArts.id}
            usersInfo={usersInfo}
            setUsersInfo={setUsersInfo}
          ></OneArticle>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

//クエリから記事を取得
async function getArticleFromQuery(tag: string | null) {
  if (tag === null) return;
  const newArticle: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
  const thisQuery =
    tag != "すべて"
      ? query(
          collection(db, "world"),
          where("tags", "array-contains", tag),
          orderBy("createdAt", "desc"),
          limit(20)
        )
      : query(collection(db, "world"), orderBy("createdAt", "desc"), limit(20));
  const docs = await getDocs(thisQuery);
  docs.forEach((oneDoc) => {
    newArticle.push(oneDoc);
  });
  return newArticle;
}
