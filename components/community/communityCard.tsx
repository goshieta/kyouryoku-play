import { communityType } from "@/pages/community";
import styles from "@/styles/components/community.module.css";

//コミュニティ一覧に表示する一つのコミュニティのカード
export default function CommunityCard({
  communityInfo,
}: {
  communityInfo: communityType;
}) {
  communityInfo.icon.length = 16;
  //4*4の二次元配列にする
  const rows = 4;
  const cols = 4;
  const iconArray: string[][] = [];
  for (let i = 0; i < rows; i++) {
    iconArray.push(communityInfo.icon.slice(i * cols, (i + 1) * cols));
  }
  return (
    <div className={styles.card}>
      <div className={styles.cardIconArea}>
        {iconArray.map((oneRow, index) => (
          <div
            key={`icon_${communityInfo.name}_row_${index}`}
            className={styles.community_icon_row}
          >
            {oneRow.map((onePix, col) => (
              <div
                style={{ backgroundColor: `#${onePix}` }}
                key={`icon_${communityInfo.name}_row_${index}_col_${col}`}
                className={styles.community_icon_pixel}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.cardDescArea}>
        <h3>{communityInfo.name}</h3>
        <p>{communityInfo.description}</p>
      </div>
      <div className={styles.cardButtonArea}>
        <button>
          <span className="material-symbols-outlined">group_add</span>参加
        </button>
      </div>
    </div>
  );
}
