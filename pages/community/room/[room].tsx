import { db } from "@/lib/firebase/client";
import {
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { communityType, isCommunityType, isUserType, userType } from "..";
import ChatRoomLayhout from "@/components/layouts/chatRoomLayout";
import styles from "@/styles/components/chatroom.module.css";
import OneMessage from "@/components/community/oneMessage";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useAuth } from "@/components/context/auth";
import createUUID from "@/lib/uuid";

type roomInfoType = communityType & {
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

  const [snapShot, setSnapshot] = useState<QuerySnapshot<
    DocumentData,
    DocumentData
  > | null>(null);
  const [roomInfo, setRoomInfo] = useState<roomInfoType | undefined | null>(
    undefined
  );
  const [messages, setMessages] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[] | undefined
  >(undefined);

  const [usersInfo, setUsersInfo] = useState<{
    [key: string]: userType;
  } | null>(null);

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
        orderBy("createdAt", "desc"),
        queryLimit,
        where("room", "==", roomID)
      );
      const querySnapshot = await getDocs(q);
      reload(querySnapshot);
    };

    getRoomInfo().then((result) => {
      if (result) getMessages();
      else setRoomInfo(null);
    });
  }, [roomID]);

  useEffect(() => {
    if (!roomID) return;
    const q = query(
      collection(db, "message"),
      orderBy("createdAt", "desc"),
      limit(2),
      where("room", "==", roomID)
    );
    return onSnapshot(q, (thisSnapShot) => {
      setSnapshot(thisSnapShot);
    });
  }, [roomID]);

  useEffect(() => {
    //なぜかこのuseEffectがないと動かない。
    if (snapShot) {
      reload(snapShot);
    }
  }, [snapShot]);

  const reload = (querySnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
    //渡されたデータをもとにmessagesを更新する。
    const documentArray: QueryDocumentSnapshot<DocumentData, DocumentData>[] =
      [];
    querySnapshot.forEach((oneDoc) => documentArray.push(oneDoc));
    documentArray.reverse();
    if (!messages) {
      setMessages(documentArray);
      return;
    }
    const defaultMessagesArray = messages ? messages : [];
    const newMessageArray: QueryDocumentSnapshot<DocumentData, DocumentData>[] =
      [];

    while (!(documentArray.length === 0 && defaultMessagesArray.length === 0)) {
      //documentArrayの一番目に格納されているメッセージとdefaultMessagesArrayの一番目に格納されているメッセージのうち、
      //タイムスタンプが早いものを先に配列に格納する。
      //そのあとに削除する。
      type docData =
        | QueryDocumentSnapshot<DocumentData, DocumentData>
        | undefined;
      const latestDoc: docData = documentArray[0];
      const defaultDoc: docData = defaultMessagesArray[0];
      //片方の配列の長さがもう0の可能性がある。
      if (documentArray.length === 0) {
        newMessageArray.push(defaultDoc);
        defaultMessagesArray.shift();
        continue;
      } else if (defaultMessagesArray.length === 0) {
        newMessageArray.push(latestDoc);
        documentArray.shift();
        continue;
      }
      //データ
      const latestData = latestDoc.data();
      const defaultData = defaultDoc.data();
      if (!(isMessageType(latestData) && isMessageType(defaultData))) continue;
      if (latestData.createdAt < defaultData.createdAt) {
        newMessageArray.push(latestDoc);
        documentArray.shift();
      } else if (latestData.createdAt > defaultData.createdAt) {
        newMessageArray.push(defaultDoc);
        defaultMessagesArray.shift();
      } else if (latestData.createdAt == defaultData.createdAt) {
        if (latestDoc.id === defaultDoc.id) {
          //idが一致したら同じメッセージ
          newMessageArray.push(latestDoc);
          documentArray.shift();
          defaultMessagesArray.shift();
        } else {
          //idが一致しなかったら違うメッセージ
          newMessageArray.push(defaultDoc);
          defaultMessagesArray.shift();
          newMessageArray.push(latestDoc);
          documentArray.shift();
        }
      }
    }
    setMessages(newMessageArray);
  };

  //通信量を抑えるためにここでユーザーデータを最初に取得する
  useEffect(() => {
    const getUsersInfo = async () => {
      if (!messages) return;
      if (!usersInfo) {
        let newUsers: { [key: string]: userType } = {};
        for (const oneMessage of messages) {
          const localUserInfo = newUsers[oneMessage.data().user];
          if (localUserInfo === undefined) {
            await getDoc(doc(db, "users", oneMessage.data().user)).then(
              (user) => {
                const data = user.data();
                if (isUserType(data)) {
                  newUsers = { ...newUsers, [oneMessage.data().user]: data };
                }
              }
            );
          }
        }
        setUsersInfo(newUsers);
      }
    };
    getUsersInfo();
  }, [messages]);

  const normalRoom = (
    <>
      <div id={styles.topArea}>
        <div id={styles.navigationArea}>
          <div className={styles.iconArea}>
            <p>{roomInfo?.icon}</p>
          </div>
          <h1>{roomInfo?.name}</h1>
          <p>{roomInfo?.description}</p>
        </div>
      </div>
      <div id={styles.messageArea}>
        {messages?.map((oneMessage) => {
          const data = oneMessage.data();
          if (!isMessageType(data) || usersInfo === null) {
            return <React.Fragment key={oneMessage.id}></React.Fragment>;
          }
          return (
            <OneMessage
              messageInfo={data}
              key={oneMessage.id}
              usersInfo={usersInfo}
              setUsersInfo={setUsersInfo}
            ></OneMessage>
          );
        })}
      </div>
      <div id={styles.footArea}>
        <PostMessageUI roomInfo={roomInfo ? roomInfo : undefined} />
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

function PostMessageUI({ roomInfo }: { roomInfo: roomInfoType | undefined }) {
  const [message, setMessage] = useState("");
  const userInfo = useAuth();

  const postMessage = async () => {
    if (!userInfo) {
      alert("ユーザー認証情報が不正です");
      return;
    }
    if (!roomInfo) {
      return;
    }
    const newMessage: messageType = {
      createdAt: new Date().getTime(),
      room: roomInfo.id,
      user: userInfo.id,
      val: message,
    };
    await setDoc(doc(db, "message", createUUID()), newMessage);
    setMessage("");
  };

  return (
    <>
      <div id={styles.inputArea}>
        <input
          type="text"
          placeholder="投稿を入力"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={postMessage}>
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </>
  );
}
