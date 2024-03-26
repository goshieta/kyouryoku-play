import { useAuth } from "@/components/context/auth";
import useMessage from "@/components/tips/useMessage";
import { deleteUserOfCommunity } from "@/lib/community/communityUserOperation";
import { db } from "@/lib/firebase/client";
import { isPubUserDataType, pubUserDataType } from "@/lib/types/communityType";
import { roomInfoType } from "@/pages/community/room/[room]";
import styles from "@/styles/components/community/roomInfo.module.css";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
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
  const isThisRoomAdmin = thisUserInfo?.id === roomInfo.admin;
  const router = useRouter();

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
                  {thisUserInfo?.id === roomInfo.admin &&
                  oneUser.id !== roomInfo.admin ? (
                    <button
                      id={styles.userDelete}
                      onClick={async () => {
                        const result = await show(
                          "alert",
                          `ユーザー「${oneUser.name}」を本当に削除しますか？この操作は取り消すことができません。`,
                          [
                            {
                              name: "キャンセル",
                              value: "cancel",
                              type: "cancel",
                            },
                            { name: "削除", value: "delete" },
                          ]
                        );
                        if (result === "delete" && thisUserInfo) {
                          await deleteUserOfCommunity(
                            oneUser,
                            thisUserInfo,
                            roomInfo
                          );
                          await show(
                            "info",
                            `ユーザー「${oneUser.name}」を削除しました。`
                          );
                          window.location.reload();
                        }
                      }}
                    >
                      削除
                    </button>
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
          {thisUserInfo && roomInfo.people.includes(thisUserInfo.id) ? (
            <button
              id={styles.byby}
              onClick={() => {
                show(
                  "error",
                  `「${roomInfo.name}」${
                    isThisRoomAdmin
                      ? "を本当に削除しますか？この操作は取り消すことが出来ません。"
                      : "から本当に退会しますか？"
                  }`,
                  [
                    { name: "キャンセル", value: "cancel", type: "cancel" },
                    { name: isThisRoomAdmin ? "削除" : "退会", value: "byby" },
                  ]
                ).then((mes) => {
                  if (mes === "byby" && thisUserInfo) {
                    //退会の処理を記述
                    const byby = async () => {
                      await deleteUserOfCommunity(
                        thisUserInfo,
                        thisUserInfo,
                        roomInfo
                      );
                      await show(
                        "info",
                        `コミュニティ「${roomInfo.name}」${
                          isThisRoomAdmin ? "を削除" : "から退会"
                        }しました。`
                      );
                      router.back();
                    };
                    byby();
                  }
                });
              }}
            >
              {isThisRoomAdmin ? "削除" : "退会"}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
