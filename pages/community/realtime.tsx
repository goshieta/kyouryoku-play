import Channel from "@/components/community/realtime/channel";
import Keyboard from "@/components/community/realtime/keyboard";
import RealtimeCanvas from "@/components/community/realtime/realtimeCanvas";
import Head from "next/head";
import { useState } from "react";
import styles from "@/styles/components/community/realtime.module.css";

//モールス信号みたいな感じでリアルタイムで会話を楽しむ
export default function Realtime() {
  const maxFrequency = 9;
  const minFrequency = 0;
  const [frequency, setFrequency] = useState(
    Math.floor(Math.random() * (maxFrequency - minFrequency) + minFrequency)
  );

  return (
    <div id={styles.parent}>
      <Head>
        <title>リアルタイム通信 | 峡緑プレイ</title>
      </Head>
      <h1>リアルタイム通信</h1>
      <Channel
        frequency={frequency}
        setFrequency={setFrequency}
        min={minFrequency}
        max={maxFrequency}
      />
      <RealtimeCanvas />
      <Keyboard />
    </div>
  );
}
