import Channel from "@/components/community/realtime/channel";
import Keyboard from "@/components/community/realtime/keyboard";
import RealtimeCanvas from "@/components/community/realtime/realtimeCanvas";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "@/styles/components/community/realtime.module.css";
import { type Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

//モールス信号みたいな感じでリアルタイムで会話を楽しむ
export default function Realtime() {
  const maxFrequency = 9;
  const minFrequency = 0;
  const [frequency, setFrequency] = useState(
    Math.floor(Math.random() * (maxFrequency - minFrequency) + minFrequency)
  );

  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >(undefined);

  useEffect(() => {
    if (!window) return;
    const connect = async () => {
      await fetch("/api/sockets", { method: "POST" });
      const { io } = await import("socket.io-client");
      const socket = io({ autoConnect: false });
      socket.connect();
      setSocket(socket);
    };
    connect();
  }, []);

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
      <RealtimeCanvas channel={frequency} socket={socket} />
      <Keyboard socket={socket} channel={frequency} />
    </div>
  );
}
