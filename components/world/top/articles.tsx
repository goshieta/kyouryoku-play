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
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import OneArticle, { getOneUserInfo } from "./oneArticle";
import { DocumentData } from "firebase-admin/firestore";

export default function Articles({ tag }: { tag: string | null }) {
  const [arts, setArts] = useState<oneArticleType[] | undefined>(undefined);
  const [artSnapshots, setArtsSnapShots] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [usersInfo, setUsersInfo] = useState<
    { [key: string]: pubUserDataType } | undefined
  >(undefined);
  const [reloadTime, setReloadTime] = useState(0);

  useEffect(() => {
    const newArts: oneArticleType[] = [];
    artSnapshots.forEach((oneSnapshot) => {
      const data = oneSnapshot.data();
      if (isOneArticleType(data)) newArts.push(data);
    });
    if (reloadTime === 0) {
      setArts(newArts);
    } else if (arts) {
      setArts(connectInvalidData(arts, newArts));
    }
    setReloadTime(reloadTime + 1);
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

  //更新処理と取得
  useEffect(() => {
    setReloadTime(0);
    const thisQuery =
      tag != "すべて"
        ? query(
            collection(db, "world"),
            where("tags", "array-contains", tag),
            orderBy("createdAt", "desc"),
            limit(20)
          )
        : query(
            collection(db, "world"),
            orderBy("createdAt", "desc"),
            limit(20)
          );
    const unsub = onSnapshot(thisQuery, (docs) => {
      const snapShots: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
      docs.forEach((oneDoc) => {
        snapShots.push(oneDoc);
      });
      setArtsSnapShots(snapShots);
    });
    return unsub;
  }, [tag]);

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
      <button id={styles.readMore}>
        <span className="material-symbols-outlined">read_more</span>
        さらに読み込む
      </button>
    </div>
  );
}

function connectInvalidData(
  beforeData: oneArticleType[],
  newData: oneArticleType[]
) {
  //入力データは順番に並んでいる必要がある
  //0に近づくほどタイムスタンプが大きくなる。0から遠ざかるほどタイムスタンプが小さくなる
  let result = beforeData;
  newData.forEach((oneData) => {
    //resultの中に同じデータが含まれていないことを確認する
    if (result.find((oneResultData) => oneResultData.id === oneData.id)) return;
    //resultの中からタイムスタンプが間のところを見つける
    let lastTimeStamp = new Date().getTime() + (2 ^ 64);
    let nowIndex = 0;
    while (oneData.createdAt > lastTimeStamp) {
      lastTimeStamp = result[nowIndex].createdAt;
      nowIndex++;
    }
    result.splice(nowIndex, 0, oneData);
  });
  return result;
}
