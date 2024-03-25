import { communityType } from "@/lib/types/communityType";
import styles from "@/styles/components/community/community.module.css";
import { useRouter } from "next/router";
import { useAuth } from "../context/auth";
import { addUserInComunity } from "@/lib/community/communityUserOperation";

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
    String(num).padStart(digit, "0");

  const router = useRouter();
  const userData = useAuth();

  return (
    <div className={styles.card}>
      <div className={styles.cardIconArea}>
        <p>{communityInfo.icon}</p>
      </div>
      <div className={styles.cardDescArea}>
        <h3>{communityInfo.name}</h3>
        <div className={styles.cardDetailArea}>
          <p className={styles.time}>{`作成 : ${createdTime.getFullYear()}/${
            createdTime.getMonth() + 1
          }/${createdTime.getDate()} ${zeroPadding(
            createdTime.getHours(),
            2
          )}:${zeroPadding(createdTime.getMinutes(), 2)}`}</p>
          <p className={styles.peopleNumber}>
            <span className="material-symbols-outlined">groups</span>
            {communityInfo.peopleNumber}人
          </p>
        </div>
        <p>{communityInfo.description}</p>
      </div>
      <div className={styles.cardButtonArea}>
        <button
          onClick={() => {
            if (preview) {
              alert("プレビューです");
              return;
            }
            router.push(`./community/room/${communityInfo.id}`);
          }}
        >
          <span className="material-symbols-outlined">visibility</span>
          {communityInfo.people.includes(userData ? userData.id : "")
            ? "訪問"
            : "見学"}
        </button>
        {communityInfo.people.includes(userData ? userData.id : "") ? (
          <p className={styles.haveCommited}>
            <span className="material-symbols-outlined">done</span>参加済
          </p>
        ) : (
          <button
            onClick={async () => {
              if (preview) {
                alert("プレビューです");
                return;
              }
              if (!userData) {
                alert("認証情報が不正です");
                return;
              }
              const communityState = await addUserInComunity(
                userData,
                communityInfo
              );
              if (communityState.state) {
                alert("コミュニティに参加しました");
                router.push(`./community/room/${communityInfo.id}`);
              } else {
                alert(communityState.error);
              }
            }}
          >
            <span className="material-symbols-outlined">group_add</span>参加
          </button>
        )}
      </div>
    </div>
  );
}
