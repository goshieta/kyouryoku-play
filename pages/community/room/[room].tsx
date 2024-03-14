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
import ChatRoomLayhout from "@/components/layouts/chatRoomLayout";
import styles from "@/styles/components/chatroom.module.css";
import OneMessage from "@/components/community/oneMessage";
import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

type roomInfo = communityType & {
  permissions: "readonly" | "readwrite";
};
export type messageType = {
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
  const [messages, setMessages] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[] | undefined
  >(undefined);

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
      const newMessages: QueryDocumentSnapshot<DocumentData, DocumentData>[] =
        [];
      querySnapshot.forEach((result) => {
        const nr: any = result;
        newMessages.push(nr);
      });
      setMessages(newMessages);
    };

    getRoomInfo().then((result) => {
      if (result) getMessages();
      else setRoomInfo(null);
    });
  }, [roomID]);

  const normalRoom = (
    <>
      <div id={styles.messageArea}>
        {messages?.map((oneMessage) => {
          const data = oneMessage.data();
          if (!isMessageType(data)) {
            return <></>;
          }
          return (
            <OneMessage messageInfo={data} key={oneMessage.id}></OneMessage>
          );
        })}
      </div>
      <div id={styles.footArea}>
        <div id={styles.inputArea}>
          <input type="text" />
          <button>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <div id={styles.navigationArea}>
          <div className={styles.iconArea}>
            <p>{roomInfo?.icon}</p>
          </div>
          <h1>{roomInfo?.name}</h1>
        </div>
      </div>
    </>
  );

  return (
    <div>{roomInfo !== null ? normalRoom : <p>存在しない部屋です。</p>}</div>
  );
}

Room.getLayout = function getLayout(page: ReactElement) {
  return <ChatRoomLayhout>{page}</ChatRoomLayhout>;
};
