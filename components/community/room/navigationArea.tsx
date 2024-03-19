import { communityType } from "@/lib/types/community";
import styles from "@/styles/components/chatroom.module.css";
import { useRouter } from "next/router";

export default function NavigationAreaUI({
  roomInfo,
}: {
  roomInfo: communityType;
}) {
  const router = useRouter();
  return (
    <div id={styles.navigationArea}>
      <button id={styles.naviBack} onClick={() => router.back()}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </button>
      <div className={styles.iconArea}>
        <p>{roomInfo.icon}</p>
      </div>
      <h1 id={styles.titleDesc}>{roomInfo.name}</h1>
      <p id={styles.roomDesc}>{roomInfo.description}</p>
      <h2>{roomInfo.topic}</h2>
    </div>
  );
}
