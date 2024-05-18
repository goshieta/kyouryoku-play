import { db } from "@/lib/firebase/client";
import {
  isOneArticleType,
  oneArticleType,
  pubUserDataType,
} from "@/lib/types/communityType";
import styles from "@/styles/world/world.module.css";
import {
  CollectionReference,
  QueryDocumentSnapshot,
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import OneArticle, { getOneUserInfo } from "./oneArticle";
import { DocumentData } from "firebase-admin/firestore";
import SearchAccounts from "./accounts";
import useHasMounted from "@/lib/tips/useHasMounted";

export default function Articles({
  customQuery,
  queryString,
}: {
  customQuery: QueryFieldFilterConstraint[] | undefined;
  queryString: string | null | undefined;
}) {
  const [arts, setArts] = useState<oneArticleType[] | undefined>(undefined);
  const [artSnapshots, setArtsSnapShots] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const [usersInfo, setUsersInfo] = useState<
    { [key: string]: pubUserDataType } | undefined
  >(undefined);
  const [reloadTime, setReloadTime] = useState(0);
  const [isReadMoreDisplay, setIsReadMoreDisplay] = useState(true);
  const hasMounted = useHasMounted();

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
    if (!customQuery) return;
    setReloadTime(0);
    setIsReadMoreDisplay(true);
    const thisQuery = query(
      collection(db, "world"),
      orderBy("createdAt", "desc"),
      limit(20),
      ...customQuery
    );
    const unsub = onSnapshot(thisQuery, (docs) => {
      const snapShots: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
      docs.forEach((oneDoc) => {
        snapShots.push(oneDoc);
      });
      setArtsSnapShots(snapShots);
      if (snapShots.length < 20) setIsReadMoreDisplay(false);
    });
    return unsub;
  }, [customQuery]);

  const readMore = async () => {
    if (!customQuery) return;
    if (!arts) return;
    const args: [
      CollectionReference,
      QueryOrderByConstraint,
      QueryFieldFilterConstraint,
      QueryLimitConstraint
    ] = [
      collection(db, "world"),
      orderBy("createdAt", "desc"),
      where("createdAt", "<", arts[arts.length - 1].createdAt),
      limit(20),
    ];
    const thisQuery = query(...args, ...customQuery);
    const docs = await getDocs(thisQuery);
    const docArray: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
    docs.forEach((oneDoc) => docArray.push(oneDoc));
    setArtsSnapShots(docArray);
    if (docArray.length < 20) setIsReadMoreDisplay(false);
  };

  return (
    <div id={styles.articles}>
      {hasMounted && queryString && (
        <SearchAccounts queryString={queryString} />
      )}
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
      {isReadMoreDisplay ? (
        <button id={styles.readMore} onClick={readMore}>
          <span className="material-symbols-outlined">read_more</span>
          さらに読み込む
        </button>
      ) : (
        <p id={styles.lastMessage}>これ以上の投稿がありません</p>
      )}
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
    while (oneData.createdAt < lastTimeStamp) {
      if (result[nowIndex]) lastTimeStamp = result[nowIndex].createdAt;
      else lastTimeStamp = 0;
      nowIndex++;
    }
    result.splice(nowIndex, 0, oneData);
  });
  return result;
}
