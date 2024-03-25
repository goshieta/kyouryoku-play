import styles from "@/styles/components/tips/message.module.css";
import { messageButtonType, messageType } from "./useMessage";

export default function Message({
  messageType,
  message,
  button,
  onButtonClicked,
}: {
  //infoは情報を表示するのに使う。alertは「～でいいですか？」などの確認用のダイアログ。errorはエラーを表示する。
  messageType: messageType;
  message: string;
  button: messageButtonType[];
  onButtonClicked: (e: any) => void;
}) {
  return (
    <div id={styles.back}>
      <div
        id={styles.messageParent}
        className={styles[`message_${messageType}`]}
      >
        <div id={styles.infomation}>
          <p>{message}</p>
        </div>
        <div id={styles.buttonArea}>
          {button.map((onestr) => (
            <button
              onClick={() => onButtonClicked(onestr.value)}
              key={`message_button_${onestr.value}`}
              className={
                styles[
                  `message_button_type_${onestr.type ? onestr.value : "normal"}`
                ]
              }
            >
              {onestr.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
