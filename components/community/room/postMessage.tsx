import { useAuth } from "@/components/context/auth";
import createUUID from "@/lib/uuid";
import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import { roomInfoType } from "@/pages/community/room/[room]";
import { messageType } from "@/lib/types/communityType";
import { useState } from "react";
import styles from "@/styles/components/chatroom.module.css";
import { addUserInComunity } from "@/lib/communityUserOperation";
import { login } from "@/lib/auth";

export default function PostMessageUI({
  roomInfo,
}: {
  roomInfo: roomInfoType | undefined;
}) {
  const [message, setMessage] = useState("");
  const userInfo = useAuth();

  const postMessage = async () => {
    if (!userInfo) {
      alert("エラー : ユーザー認証情報が不正です");
      return;
    }
    if (!roomInfo) {
      return;
    }
    if (!roomInfo.people.includes(userInfo.id)) {
      alert("エラー : コミュニティに参加していません");
      return;
    }
    if (message === "") {
      alert("エラー : 何も入力されていません。");
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

  const ui = {
    noLogin: (
      <div id={styles.exceptionArea}>
        <p id={styles.exceptionDesc}>
          投稿をするにはログインをする必要があります。
        </p>
        <button id={styles.exceptionButton} onClick={login}>
          ログイン
        </button>
      </div>
    ),
    noJoin: (
      <div id={styles.exceptionArea}>
        <p id={styles.exceptionDesc}>
          投稿をするにはコミュニティに参加する必要があります。
        </p>
        <button
          id={styles.exceptionButton}
          onClick={async () => {
            if (!userInfo || !roomInfo) return;
            const addUserInfo = await addUserInComunity(userInfo, roomInfo);
            if (addUserInfo.state) {
              window.location.reload();
            }
          }}
        >
          <span className="material-symbols-outlined">group_add</span>参加
        </button>
      </div>
    ),
    canSend: (
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
    ),
  };

  if (!userInfo) {
    return ui.noLogin;
  } else if (!roomInfo?.people.includes(userInfo.id)) {
    return ui.noJoin;
  } else {
    return ui.canSend;
  }
}
