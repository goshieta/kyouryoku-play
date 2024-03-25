import { communityType } from "@/lib/types/communityType";
import styles from "@/styles/components/community/chatroom.module.css";
import { useRouter } from "next/router";

export default function NavigationAreaUI({
  roomInfo,
  isShowRoomInfo,
  setIsShowRoomInfo,
}: {
  roomInfo: communityType;
  isShowRoomInfo: boolean;
  setIsShowRoomInfo: (newValue: boolean) => void;
}) {
  const router = useRouter();
  return (
    <div id={styles.navigationArea}>
      <button id={styles.naviBack} onClick={() => router.back()}>
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </button>
      <button
        className={styles.iconArea}
        onClick={() => setIsShowRoomInfo(!isShowRoomInfo)}
      >
        <p>{roomInfo.icon}</p>
      </button>
      <h1 id={styles.titleDesc}>{roomInfo.name}</h1>
      <p id={styles.roomDesc}>{roomInfo.description}</p>
      <h2>{roomInfo.topic}</h2>
    </div>
  );
}
