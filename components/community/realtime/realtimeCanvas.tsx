import styles from "@/styles/components/community/realtime.module.css";
import { useEffect } from "react";
import { type Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function RealtimeCanvas({
  channel,
  socket,
}: {
  channel: number;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}) {
  useEffect(() => {
    const channelName = `channel${channel}`;
    const messageFunction = (message: unknown) => {
      console.log(message);
      return;
    };
    socket?.on(channelName, messageFunction);
    return () => {
      socket?.off(channelName, messageFunction);
    };
  }, [channel, socket]);

  return <div id={styles.display}></div>;
}
