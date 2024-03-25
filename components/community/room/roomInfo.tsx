import { useAuth } from "@/components/context/auth";
import useMessage from "@/components/tips/useMessage";
import { db } from "@/lib/firebase/client";
import { isPubUserDataType, pubUserDataType } from "@/lib/types/communityType";
import { roomInfoType } from "@/pages/community/room/[room]";
import styles from "@/styles/components/community/roomInfo.module.css";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export default function RoomInfo({
  roomInfo,
  setIsShowModalWindow,
}: {
  roomInfo: roomInfoType;
  setIsShowModalWindow: (newVal: boolean) => void;
}) {
  const [userInfo, setUserInfo] = useState<pubUserDataType[] | undefined>(
    undefined
  );
  const thisUserInfo = useAuth();

  const getUserInfo = useCallback(async () => {
    const results = [];
    for (let userId of roomInfo.people) {
      results.push(getDoc(doc(db, "pubUsers", userId)));
    }

    const newUserInfo: pubUserDataType[] = [];
    (await Promise.all(results)).forEach((oneDoc) => {
      const data = oneDoc.data();
      if (isPubUserDataType(data)) newUserInfo.push(data);
    });

    setUserInfo(newUserInfo);
  }, [roomInfo]);

  useEffect(() => {
    getUserInfo();
  }, []);

  const [show, MessageDialog] = useMessage();

  return (
    <div id={styles.parent}>
      <MessageDialog />
      <div id={styles.modal}>
        <div id={styles.roomBasicInfo}>
          <h2>{roomInfo.name}</h2>
          <p>{roomInfo.description}</p>
          <div id={styles.topic}>
            <p>テーマ : </p>
            <p>{roomInfo.topic}</p>
          </div>
        </div>
        <div id={styles.roomUserInfo}>
          {userInfo?.map((oneUser) => {
            return (
              <div key={oneUser.id} id={styles.oneUser}>
                <div id={styles.oneUserDesc}>
                  <Image
                    src={oneUser.photoURL}
                    width={30}
                    height={30}
                    alt={`${oneUser.name}の画像`}
                  ></Image>
                  <p>{oneUser.name}</p>
                  {oneUser.id === roomInfo.admin ? (
                    <p id={styles.admin}>オーナー</p>
                  ) : (
                    <></>
                  )}
                </div>
                <div id={styles.oneUserOperation}>
                  {thisUserInfo?.id === roomInfo.admin ? (
                    <button id={styles.userDelete}>削除</button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div id={styles.buttonArea}>
          <button onClick={() => setIsShowModalWindow(false)}>閉じる</button>
          <button
            id={styles.byby}
            onClick={() => {
              show("error", `「${roomInfo.name}」から本当に退会しますか？`, [
                { name: "キャンセル", value: "cancel", type: "cancel" },
                { name: "退会", value: "byby" },
              ]).then((mes) => console.log(mes));
            }}
          >
            退会
          </button>
        </div>
      </div>
    </div>
  );
}
