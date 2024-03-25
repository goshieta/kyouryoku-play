import { db } from "@/lib/firebase/client";
import {
  messageType,
  pubUserDataType,
  isPubUserDataType,
} from "@/lib/types/communityType";
import styles from "@/styles/components/community/chatroom.module.css";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OneMessage({
  messageInfo,
  usersInfo,
  setUsersInfo,
  communityAdmin,
}: {
  messageInfo: messageType;
  usersInfo: {
    [key: string]: pubUserDataType;
  };
  setUsersInfo: (newInfo: { [key: string]: pubUserDataType }) => void;
  communityAdmin: string;
}) {
  const [pubUserInfo, setPubUserInfo] = useState<pubUserDataType | null>(null);
  useEffect(() => {
    const localUserInfo = usersInfo[messageInfo.user];
    if (localUserInfo === undefined) {
      getDoc(doc(db, "pubUsers", messageInfo.user)).then((user) => {
        const data = user.data();
        if (isPubUserDataType(data)) {
          setPubUserInfo(data);
          setUsersInfo({ ...usersInfo, [messageInfo.user]: data });
        }
      });
    } else {
      setPubUserInfo(localUserInfo);
    }
  }, []);

  const zeroPadding = (num: number, digit: number) =>
    ("0".repeat(digit) + num).slice(-digit);
  const publishTime = new Date(messageInfo.createdAt);

  return (
    <div className={styles.message}>
      <div className={styles.messageHeader}>
        {pubUserInfo ? (
          <>
            <Image
              src={pubUserInfo.photoURL}
              width={30}
              height={30}
              alt="ユーザー画像"
            ></Image>
            <p>{pubUserInfo?.name}</p>
          </>
        ) : (
          <></>
        )}
        {communityAdmin === pubUserInfo?.id ? (
          <p className={styles.adminTip}>オーナー</p>
        ) : (
          <></>
        )}
        <p>{`${zeroPadding(publishTime.getHours(), 2)}:${zeroPadding(
          publishTime.getMinutes(),
          2
        )}`}</p>
      </div>
      <div className={styles.messageBody}>
        <p>{messageInfo.val}</p>
      </div>
    </div>
  );
}
