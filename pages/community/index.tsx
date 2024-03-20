import CommunityCard from "@/components/community/communityCard";
import Filter, { Options } from "@/components/community/filter";
import Loading from "@/components/tips/loading";
import { db } from "@/lib/firebase/client";
import styles from "@/styles/components/community.module.css";
import { communityType, isCommunityType } from "@/lib/types/communityType";
import { searchNgram } from "@/lib/firebase/ngram";
import {
  Query,
  collection,
  doc,
  getDoc,
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
        q = query(
          communitesRef,
          orderBy("peopleNumber", "desc"),
          orderBy("createdAt", "desc"),
          queryLimit
        );
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

  const searchFromString = async () => {
    if (searchString === "") return;
    if (searchString.length === 1) {
      alert("1文字じゃ検索できん。2文字以上入力して。");
      return;
    }
    const result = await searchNgram(searchString, "searchCommunity");
    console.log(result);
    setSearchOption(undefined);
    const newCommunitys: communityType[] = [];
    for (let i = 0; i < result.length; i++) {
      const oneID = result[i];
      const docRef = await getDoc(doc(db, "community", oneID));
      const docData = docRef.data();
      if (isCommunityType(docData)) {
        newCommunitys.push(docData);
      }
    }
    setCommunityInfo(newCommunitys);
  };

  return (
    <div id={styles.parent}>
      <h1>コミュニティ</h1>
      <div id={styles.top}>
        <Filter
          searchString={searchString}
          setSearchString={setSearchString}
          searchOption={searchOption}
          setSearchOption={setSearchOption}
          onSearchClicked={searchFromString}
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
