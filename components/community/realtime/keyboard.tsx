import { useEffect, useState } from "react";
import styles from "@/styles/components/community/realtime.module.css";

export default function Keyboard() {
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

  return (
    <div id={styles.keyboard}>
      <div id={styles.keyParent}>
        {keyboardString.map((oneChara) => {
          return <button>{oneChara}</button>;
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
