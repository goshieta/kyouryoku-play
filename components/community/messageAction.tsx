import { messageType } from "@/lib/types/communityType";
import styles from "@/styles/components/community/chatroom.module.css";

export default function MessageAction({
  messageInfo,
}: {
  messageInfo: messageType;
}) {
  return (
    <div className={styles.messageAction}>
      <button className={styles.messageActionGood}>
        <span className="material-symbols-outlined">sunny</span>
        {messageInfo.good}
      </button>
      <button className={styles.messageActionReport}>
        <span className="material-symbols-outlined">report</span>
      </button>
    </div>
  );
}
