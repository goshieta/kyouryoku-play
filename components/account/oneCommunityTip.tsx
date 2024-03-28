import { communityType, userType } from "@/lib/types/communityType";
import styles from "@/styles/pages/account.module.css";
import useMessage from "../tips/useMessage";
import { useRouter } from "next/router";
import { deleteUserOfCommunity } from "@/lib/community/communityUserOperation";

export default function OneCommunityTip({
  communityInfo,
  userInfo,
}: {
  communityInfo: communityType;
  userInfo: userType;
}) {
  const [show, Message] = useMessage();
  const router = useRouter();

  const visit = () => {
    router.push(`/community/room/${communityInfo.id}`);
  };
  const byby = async () => {
    const result = await show(
      "alert",
      `コミュニティ「${communityInfo.name}」を退会しますか？`,
      [
        { name: "キャンセル", value: "cancel", type: "cancel" },
        { name: "退会", value: "byby" },
      ]
    );
    if (result === "byby") {
      await deleteUserOfCommunity(userInfo, userInfo, communityInfo);
      await show(
        "info",
        `コミュニティ「${communityInfo.name}」を退会しました。`
      );
      router.reload();
    }
  };

  return (
    <div className={styles.oneCommunity}>
      <Message />
      <div className={styles.oneCommunityInfo}>
        <div className={styles.caption}>
          <div className={styles.iconArea}>
            <p>{communityInfo.icon}</p>
          </div>
          <h3>{communityInfo.name}</h3>
        </div>
        <p className={styles.description}>{communityInfo.description}</p>
        <div className={styles.communityState}>
          <p>
            <span className="material-symbols-outlined">groups</span>
            {communityInfo.peopleNumber}人
          </p>
          {communityInfo.admin === userInfo.id ? (
            <p className={styles.admin}>管理者</p>
          ) : (
            <></>
          )}
        </div>
        <p className={styles.topic}>{communityInfo.topic}</p>
      </div>
      <div className={styles.oneCommunityOperation}>
        <button onClick={visit}>
          <span className="material-symbols-outlined">visibility</span>訪問
        </button>
        <button className={styles.byby} onClick={byby}>
          <span className="material-symbols-outlined">delete</span>退会
        </button>
      </div>
    </div>
  );
}
