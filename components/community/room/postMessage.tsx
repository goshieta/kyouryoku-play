import { useAuth } from "@/components/context/auth";
import createUUID from "@/lib/uuid";
import { db } from "@/lib/firebase/client";
import { doc, setDoc } from "firebase/firestore";
import { roomInfoType, messageType } from "@/pages/community/room/[room]";
import { useState } from "react";
import styles from "@/styles/components/chatroom.module.css";

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
