import {
  communityType,
  isCommunityType,
  userType,
} from "@/lib/types/communityType";
import styles from "@/styles/pages/account.module.css";
import { useEffect, useState } from "react";
import OneCommunityTip from "./oneCommunityTip";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export default function CommunityTip({ authInfo }: { authInfo: userType }) {
  const [communities, setCommunities] = useState<communityType[] | undefined>(
    undefined
  );

  useEffect(() => {
    //ユーザーの属しているコミュニティの情報をすべて呼び出す。
    const communityInfoPromise = authInfo.belongCommunity.map((oneComID) =>
      getDoc(doc(db, "community", oneComID))
    );
    Promise.all(communityInfoPromise).then((communitiesDoc) => {
      const newCommunities: communityType[] = [];
      communitiesDoc.forEach((oneCommunity) => {
        const data = oneCommunity.data();
        if (isCommunityType(data)) newCommunities.push(data);
      });
      setCommunities(newCommunities);
    });
  }, []);

  return (
    <div id={styles.communityTip}>
      {communities?.map((oneCommunity) => (
        <OneCommunityTip communityInfo={oneCommunity} key={oneCommunity.id} />
      ))}
    </div>
  );
}
