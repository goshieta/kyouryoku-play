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
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  communityType,
  isCommunityType,
  isMessageType,
  pubUserDataType,
  isPubUserDataType,
} from "@/lib/types/communityType";
import ChatRoomLayhout from "@/components/layouts/chatRoomLayout";
import styles from "@/styles/components/community/chatroom.module.css";
import OneMessage from "@/components/community/oneMessage";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import PostMessageUI from "@/components/community/room/postMessage";
import NavigationAreaUI from "@/components/community/room/navigationArea";
import InfiniteScroll from "@/components/community/infiniteScroll/componentForScroll";
import Head from "next/head";
import RoomInfo from "@/components/community/room/roomInfo";
import { useAuth } from "@/components/context/auth";
import useMessage from "@/components/tips/useMessage";

export type roomInfoType = communityType & {
  permissions: "readonly" | "readwrite";
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
  const [lastMessageTime, setLastMessageTime] = useState(0);

  const [usersInfo, setUsersInfo] = useState<{
    [key: string]: pubUserDataType;
  } | null>(null);
  const [isShowRoomInfo, setIsShowRoomInfo] = useState(false);

  const [isCanReadMore, setIsCanReadMore] = useState(false);

  const thisUser = useAuth();

  const [show, Message] = useMessage();

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
      if (querySnapshot.size < 20) setIsCanReadMore(false);
      else setIsCanReadMore(true);
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
      const revercedDocumentArray = documentArray.reverse();
      setMessages(revercedDocumentArray);
      if (documentArray.length === 0) return;
      const lastData = documentArray[documentArray.length - 1].data();
      if (isMessageType(lastData)) setLastMessageTime(lastData.createdAt);
      return;
    }
    const defaultMessagesArray = messages ? messages.reverse() : [];
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

    const revercedNewMessageArray = newMessageArray.reverse();
    setMessages(revercedNewMessageArray);
    if (newMessageArray.length === 0) return;
    const lastData = newMessageArray[newMessageArray.length - 1].data();
    if (isMessageType(lastData)) setLastMessageTime(lastData.createdAt);
  };

  //通信量を抑えるためにここでユーザーデータを最初に取得する
  useEffect(() => {
    const getUsersInfo = async () => {
      if (!messages) return;
      if (!usersInfo) {
        let newUsers: { [key: string]: pubUserDataType } = {};
        for (const oneMessage of messages) {
          const localUserInfo = newUsers[oneMessage.data().user];
          if (localUserInfo === undefined) {
            await getDoc(doc(db, "pubUsers", oneMessage.data().user)).then(
              (user) => {
                const data = user.data();
                if (isPubUserDataType(data)) {
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

  //追加で読み込む
  const readMore = useCallback(async () => {
    const messageRef = collection(db, "message");
    const queryLimit = limit(20);
    const q = query(
      messageRef,
      orderBy("createdAt", "desc"),
      queryLimit,
      where("room", "==", roomID),
      where("createdAt", "<", lastMessageTime)
    );
    const querySnapshot = await getDocs(q);
    setSnapshot(querySnapshot);
    if (querySnapshot.size < 20) setIsCanReadMore(false);
  }, [roomID, lastMessageTime]);

  const normalRoom = (
    <>
      <Head>
        <title>
          {`${roomInfo ? roomInfo.name : "存在しない部屋"} | 峡緑プレイ`}
        </title>
      </Head>
      <Message />
      {isShowRoomInfo && roomInfo ? (
        <RoomInfo
          roomInfo={roomInfo}
          setIsShowModalWindow={setIsShowRoomInfo}
        ></RoomInfo>
      ) : (
        <></>
      )}
      <div id={styles.roomParent}>
        <div id={styles.topArea}>
          {roomInfo ? (
            <NavigationAreaUI
              roomInfo={roomInfo}
              isShowRoomInfo={isShowRoomInfo}
              setIsShowRoomInfo={setIsShowRoomInfo}
            ></NavigationAreaUI>
          ) : (
            <></>
          )}
        </div>
        <div id={styles.messageArea}>
          {messages ? (
            <InfiniteScroll
              data={messages.map((oneMessage) => {
                const data = oneMessage.data();
                if (!isMessageType(data) || usersInfo === null) {
                  return <React.Fragment key={oneMessage.id}></React.Fragment>;
                }
                return (
                  <OneMessage
                    messageInfo={data}
                    key={oneMessage.id}
                    id={oneMessage.id}
                    usersInfo={usersInfo}
                    setUsersInfo={setUsersInfo}
                    communityAdmin={roomInfo?.admin!}
                    thisUserInfo={thisUser}
                    show={show}
                  ></OneMessage>
                );
              })}
              moreLoad={readMore}
              isCanReadMore={isCanReadMore}
            />
          ) : (
            <></>
          )}
        </div>
        <div id={styles.footArea}>
          <PostMessageUI roomInfo={roomInfo ? roomInfo : undefined} />
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
