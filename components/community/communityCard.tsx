import { communityType } from "@/pages/community";
import styles from "@/styles/components/community.module.css";

//コミュニティ一覧に表示する一つのコミュニティのカード
export default function CommunityCard({
  communityInfo,
  preview,
}: {
  communityInfo: communityType;
  preview?: boolean;
}) {
  const createdTime = new Date();
  createdTime.setTime(communityInfo.createdAt);

  const zeroPadding = (num: number, digit: number) =>
    ("0".repeat(digit) + num).slice(-digit);

  return (
    <div className={styles.card}>
      <div className={styles.cardIconArea}>
        <p>{communityInfo.icon}</p>
      </div>
      <div className={styles.cardDescArea}>
        <h3>{communityInfo.name}</h3>
        <p className={styles.time}>{`作成 : ${createdTime.getFullYear()}/${
          createdTime.getMonth() + 1
        }/${createdTime.getDay()} ${zeroPadding(
          createdTime.getHours(),
          2
        )}:${zeroPadding(createdTime.getMinutes(), 2)}`}</p>
        <p>{communityInfo.description}</p>
      </div>
      <div className={styles.cardButtonArea}>
        <button>
          <span className="material-symbols-outlined">visibility</span>見学
        </button>
        <button>
          <span className="material-symbols-outlined">group_add</span>参加
        </button>
      </div>
    </div>
  );
}
