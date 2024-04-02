import { useEffect, useState } from "react";
import styles from "@/styles/components/community/realtime.module.css";
import { type Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function Keyboard({
  channel,
  socket,
}: {
  channel: number;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}) {
  const [keyboardString, setKeyboardString] = useState<string[]>([]);

  const requestString = async () => {
    const length = 20;
    const response = await fetch(`/api/randomChara?length=${length}`);
    const data = await response.json();
    setKeyboardString(data.randomString.split(""));
  };

  useEffect(() => {
    requestString();
  }, []);

  const sendSignal = (chara: string) => {
    socket?.emit("realtime", { value: chara, channel: channel });
  };

  return (
    <div id={styles.keyboard}>
      <div id={styles.keyParent}>
        {keyboardString.map((oneChara, index) => {
          return (
            <button
              key={oneChara + index.toString()}
              onClick={() => sendSignal(oneChara)}
            >
              {oneChara}
            </button>
          );
        })}
      </div>
      <div id={styles.refreshArea}>
        <button onClick={requestString}>
          <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>
    </div>
  );
}
