import {
  communityType,
  isCommunityType,
  userType,
} from "@/lib/types/communityType";
import styles from "@/styles/pages/account.module.css";
import { useEffect, useState } from "react";
import OneCommunityTip from "./oneCommunityTip";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
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
      const invalidCommunities: string[] = [];
      communitiesDoc.forEach((oneCommunity) => {
        const data = oneCommunity.data();
        if (isCommunityType(data)) newCommunities.push(data);
        else invalidCommunities.push(oneCommunity.id);
      });
      setCommunities(newCommunities);
      updateDoc(doc(db, "users", authInfo.id), {
        belongCommunity: arrayRemove(...invalidCommunities),
      });
    });
  }, []);

  return (
    <div>
      <h2 id={styles.communityAreaTitle}>所属しているコミュニティ</h2>
      <div id={styles.communityTip}>
        {communities?.map((oneCommunity) => (
          <OneCommunityTip
            communityInfo={oneCommunity}
            key={oneCommunity.id}
            userInfo={authInfo}
          />
        ))}
      </div>
    </div>
  );
}
