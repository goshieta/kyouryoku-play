import { db } from "@/lib/firebase/client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { communityType, isCommunityType } from "..";

type roomInfo = communityType & {
  permissions: "readonly" | "readwrite";
};

export default function Room() {
  const router = useRouter();
  const roomID = router.query.room;

  const [roomInfo, setRoomInfo] = useState<roomInfo | undefined | null>(
    undefined
  );

  useEffect(() => {
    //部屋の情報の取得
    const getRoomInfo = async () => {
      if (typeof roomID !== "string") return false;
      const querySnapshot = await getDoc(doc(db, "community", roomID));
      const data = querySnapshot.data();
      if (!isCommunityType(data)) return false;
      //デバッグ用に権限は読み書きともに可能
      setRoomInfo({ ...data, permissions: "readwrite" });
      return true;
    };

    //メッセージの取得
    const getMessages = async () => {
      const messageRef = collection(db, "message");
      const queryLimit = limit(20);
      const q = query(
        messageRef,
        orderBy("createdAt"),
        queryLimit,
        where("room", "==", roomID)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((result) => {
        console.log(result.data());
      });
    };

    getRoomInfo().then((result) => {
      if (result) getMessages();
      else setRoomInfo(null);
    });
  }, [roomID]);

  return <></>;
}
