import CommunityCard from "@/components/community/communityCard";
import Filter, { Options } from "@/components/community/filter";
import { db } from "@/lib/firebase/client";
import styles from "@/styles/components/community.module.css";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export type communityType = {
  admin: string;
  name: string;
  message: {
    user: string;
    value: string;
  }[];
};

//コミュニティグループの一覧画面
export default function CommunityAll() {
  //クエリ
  const [searchString, setSearchString] = useState("");
  const [searchOption, setSearchOption] = useState<Options>("popular");

  const [communityInfo, setCommunityInfo] = useState<communityType[]>([]);

  const isCommunityType = (arg: any): arg is communityType => {
    return arg.admin !== undefined && arg.name !== undefined;
  };

  useEffect(() => {
    const getCommunityInfo = async () => {
      const communitesRef = collection(db, "community");
      const querySnapshot = await getDocs(communitesRef);
      const newCommunityInfo: communityType[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (isCommunityType(data)) {
          newCommunityInfo.push(data);
        }
      });
      setCommunityInfo(newCommunityInfo);
    };
    getCommunityInfo();
  }, []);

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
      <div id={styles.bottom}>
        {communityInfo.map((oneCommunity) => (
          <CommunityCard
            communityInfo={oneCommunity}
            key={oneCommunity.name}
          ></CommunityCard>
        ))}
      </div>
    </div>
  );
}
