import { communityType } from "@/lib/types/communityType";
import styles from "@/styles/pages/account.module.css";
import useMessage from "../tips/useMessage";

export default function OneCommunityTip({
  communityInfo,
}: {
  communityInfo: communityType;
}) {
  const [show, Message] = useMessage();

  return (
    <div className={styles.oneCommunity}>
      <Message />
      <div className={styles.oneCommunityInfo}>
        <div>
          <p>{communityInfo.icon}</p>
        </div>
        <h3>{communityInfo.name}</h3>
        <p>{communityInfo.description}</p>
        <div>
          <p>{communityInfo.peopleNumber}</p>
        </div>
        <p>{communityInfo.topic}</p>
      </div>
      <div className={styles.oneCommunityOperation}>
        <button>訪問</button>
        <button>退会</button>
      </div>
    </div>
  );
}
