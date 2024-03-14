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
import { ReactElement, useEffect, useState } from "react";
import { communityType, isCommunityType } from "..";
import Layout from "@/components/layouts/layout";
import ChatRoomLayhout from "@/components/layouts/chatRoomLayout";

type roomInfo = communityType & {
  permissions: "readonly" | "readwrite";
};
type messageType = {
  createdAt: number;
  room: string;
  user: string;
  val: string;
};
const isMessageType = (val: any): val is messageType => {
  return (
    typeof val.createdAt == "number" &&
    typeof val.room == "string" &&
    typeof val.user == "string" &&
    typeof val.val == "string"
  );
};

export default function Room() {
  const router = useRouter();
  const roomID = router.query.room;

  const [roomInfo, setRoomInfo] = useState<roomInfo | undefined | null>(
    undefined
  );
  const [messages, setMessages] = useState<messageType[] | undefined>(
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
      const newMessages: messageType[] = [];
      querySnapshot.forEach((result) => {
        const data = result.data();
        if (isMessageType(data)) {
          newMessages.push(data);
        }
      });
      setMessages(newMessages);
    };

    getRoomInfo().then((result) => {
      if (result) getMessages();
      else setRoomInfo(null);
    });
  }, [roomID]);

  return <></>;
}

Room.getLayout = function getLayout(page: ReactElement) {
  return <ChatRoomLayhout>{page}</ChatRoomLayhout>;
};
