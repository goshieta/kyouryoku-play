import Filter from "@/components/community/filter";
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
  const [communityInfo, setCommunityInfo] = useState<communityType[]>([]);

  useEffect(() => {
    const getCommunityInfo = async () => {
      const communitesRef = collection(db, "community");
      const querySnapshot = await getDocs(communitesRef);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
      });
    };
    getCommunityInfo();
  }, []);

  return (
    <div id={styles.parent}>
      <h1>コミュニティ</h1>
      <div id={styles.top}>
        <Filter></Filter>
      </div>
      <div id={styles.bottom}></div>
    </div>
  );
}
