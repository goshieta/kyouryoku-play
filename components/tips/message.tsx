import styles from "@/styles/components/tips/message.module.css";
import { messageType } from "./useMessage";

export default function Message({
  messageType,
  message,
  button,
  onButtonClicked,
}: {
  //infoは情報を表示するのに使う。alertは「～でいいですか？」などの確認用のダイアログ。errorはエラーを表示する。
  messageType: messageType;
  message: string;
  button: string[];
  onButtonClicked: (e: any) => void;
}) {
  return (
    <div id={styles.messageParent}>
      <div id={styles.head}>
        <p>{messageType}</p>
      </div>
      <div id={styles.infomation}>
        <p>{message}</p>
      </div>
      <div id={styles.buttonArea}>
        {button.map((onestr) => (
          <button
            onClick={onButtonClicked}
            key={`message_button_type_${onestr}`}
          >
            {onestr}
          </button>
        ))}
      </div>
    </div>
  );
}
