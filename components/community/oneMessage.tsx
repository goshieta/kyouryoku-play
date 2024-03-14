import { messageType } from "@/pages/community/room/[room]";
import styles from "@/styles/components/chatroom.module.css";

export default function OneMessage({
  messageInfo,
}: {
  messageInfo: messageType;
}) {
  return (
    <div className={styles.message}>
      <div></div>
      <div>
        <p>{messageInfo.val}</p>
      </div>
    </div>
  );
}
