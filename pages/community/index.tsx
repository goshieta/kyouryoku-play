import CommunityCard from "@/components/community/communityCard";
import Filter, { Options } from "@/components/community/filter";
import Loading from "@/components/tips/loading";
import { db } from "@/lib/firebase/client";
import styles from "@/styles/components/community.module.css";
import { communityType, isCommunityType } from "@/lib/types/community";
import {
  Query,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

//コミュニティグループの一覧画面
export default function CommunityAll() {
  //クエリ
  const [searchString, setSearchString] = useState("");
  const [searchOption, setSearchOption] = useState<Options>("popular");

  const [communityInfo, setCommunityInfo] = useState<
    communityType[] | undefined
  >(undefined);

  const getCommunityInfo = async () => {
    const communitesRef = collection(db, "community");
    const queryLimit = limit(5);
    let q: Query | undefined = undefined;
    switch (searchOption) {
      case "popular":
        q = query(communitesRef, orderBy("createdAt"), queryLimit);
        break;
      case "active":
        q = query(communitesRef, orderBy("createdAt"), queryLimit);
        break;
      case "latest":
        q = query(communitesRef, orderBy("createdAt", "desc"), queryLimit);
        break;
      case "oldest":
        q = query(communitesRef, orderBy("createdAt", "asc"), queryLimit);
        break;
    }
    if (q === undefined) return;
    const querySnapshot = await getDocs(q);
    const newCommunityInfo: communityType[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (isCommunityType(data)) {
        newCommunityInfo.push(data);
      }
    });
    setCommunityInfo(newCommunityInfo);
  };

  useEffect(() => {
    getCommunityInfo();
  }, [searchString, searchOption]);

  return (
    <div id={styles.parent}>
      <h1>コミュニティ</h1>
      <div id={styles.top}>
        <Filter
          searchString={searchString}
          setSearchString={setSearchString}
          searchOption={searchOption}
          setSearchOption={setSearchOption}
        ></Filter>
      </div>
      <div id={styles.add}>
        <Link href="./community/new">
          <span className="material-symbols-outlined">add</span>
          コミュニティを作成
        </Link>
      </div>
      <div id={styles.bottom}>
        {communityInfo ? (
          communityInfo.map((oneCommunity) => (
            <CommunityCard
              communityInfo={oneCommunity}
              key={oneCommunity.name}
            ></CommunityCard>
          ))
        ) : (
          <Loading></Loading>
        )}
      </div>
    </div>
  );
}
