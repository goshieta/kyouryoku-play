import { db } from "@/lib/firebase/client";
import { messageType, userType } from "@/lib/types/communityType";
import styles from "@/styles/components/community/chatroom.module.css";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { userContextType } from "../context/auth";
import { showFunctionType } from "../tips/useMessage";

export default function MessageAction({
  messageInfo,
  messageId,
  userInfo,
  show,
}: {
  messageInfo: messageType;
  messageId: string;
  userInfo: userContextType;
  show: showFunctionType;
}) {
  const [good, setGood] = useState(messageInfo.good);
  const sendGood = useCallback((goodNum: number) => {
    updateDoc(doc(db, "message", messageId), { good: goodNum });
  }, []);
  const [currentTimeOutId, setCurrentTimeOutId] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

  const addGood = useCallback(() => {
    setGood(good + 1);
    if (currentTimeOutId) {
      clearTimeout(currentTimeOutId);
    }
    //800ms以下の間隔で連打されたらまとめてリクエストを送る。無駄なリクエストをなくす
    setCurrentTimeOutId(
      setTimeout(() => {
        sendGood(good + 1);
        setCurrentTimeOutId(undefined);
      }, 800)
    );
  }, [good, currentTimeOutId]);

  const report = useCallback(async () => {
    if (!userInfo) {
      await show("info", "この機能を使うにはログインしてください。");
      return;
    }
    if (messageInfo.report.includes(userInfo.id)) {
      //すでに報告している。
      await show("info", "すでに報告しています。");
      return;
    }
    const result = await show(
      "alert",
      `本当にメッセージ「${messageInfo.val}」を報告しますか？この操作は取り消せません。`,
      [
        { value: "cancel", name: "キャンセル", type: "cancel" },
        { value: "report", name: "報告" },
      ]
    );
    if (result === "report") {
      await updateDoc(doc(db, "message", messageId), {
        report: arrayUnion(userInfo.id),
      });
      await show("info", "報告しました。");
    }
  }, [messageInfo]);

  return (
    <div className={styles.messageAction}>
      <button className={styles.messageActionGood} onClick={addGood}>
        <span className="material-symbols-outlined">sunny</span>
        {good}
      </button>
      <button className={styles.messageActionReport} onClick={report}>
        <span className="material-symbols-outlined">report</span>
      </button>
    </div>
  );
}
