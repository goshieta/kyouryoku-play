import { useAuth } from "@/components/context/auth";
import { db } from "@/lib/firebase/client";
import { isOneArticleType } from "@/lib/types/communityType";
import createUUID from "@/lib/uuid";
import styles from "@/styles/world/world.module.css";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";

export default function Reaction({
  like,
  dislike,
  reply,
  messageId,
}: {
  like: number;
  dislike: number;
  reply: number;
  messageId: string;
}) {
  const [evaluationButtonState, setEvaluationButtonState] = useState<{
    like: { previousCount: number; count: number };
    dislike: { previousCount: number; count: number };
  }>({
    like: { previousCount: like, count: like },
    dislike: { previousCount: dislike, count: dislike },
  });
  const [replyButtonState, setReplyButtonState] = useState(reply);
  const authInfo = useAuth();
  const router = useRouter();

  const clickedLikeDisLike = useCallback(
    (type: "like" | "dislike") => {
      if (!evaluationButtonState) return;
      const newVal = {
        ...evaluationButtonState,
        [type]: {
          ...evaluationButtonState[type],
          count: evaluationButtonState[type].count + 1,
        },
      };
      setEvaluationButtonState(newVal);
      postEvaluation(newVal);
    },
    [evaluationButtonState, authInfo]
  );

  const currentlyPostServerProcessID = useRef<string | null>(null);
  //サーバーの処理
  const postEvaluation = useCallback(
    (newState: {
      like: { previousCount: number; count: number };
      dislike: { previousCount: number; count: number };
    }) => {
      if (!authInfo) return;
      const thisProcessID = createUUID();
      currentlyPostServerProcessID.current = thisProcessID;
      //評価を投稿したのち、評価の合計に投稿情報を更新する
      //サーバーと同期した状態で処理を行うため、最初はサーバー情報を取得する
      const timeout = 1000;
      setTimeout(async () => {
        //もし、自分が現在のプロセスでなかったら処理をキャンセルする
        if (currentlyPostServerProcessID.current !== thisProcessID) return;
        //処理の開始
        //サーバーの状態を取得
        const currentDocSnapshot = await getDoc(
          doc(collection(db, "world"), messageId)
        );
        const data = currentDocSnapshot.data();
        if (!isOneArticleType(data)) return;
        //サーバーの状態に現在の差分を追加し、同期する
        //likeとdislikeの値を更新する
        updateDoc(doc(db, "world", messageId), {
          like: data.like + (newState.like.count - newState.like.previousCount),
          dislike:
            data.dislike +
            (newState.dislike.count - newState.dislike.previousCount),
        });
      }, timeout);
    },
    [evaluationButtonState, authInfo]
  );

  const onreply = useCallback(() => {
    //replyする
    router.push(`/world/new/reply?type=reply&target=${messageId}`);
  }, [router]);

  return evaluationButtonState ? (
    <div id={styles.reaction}>
      <button id={styles.like} onClick={() => clickedLikeDisLike("like")}>
        <span className="material-symbols-outlined">thumb_up</span>
        {evaluationButtonState.like.count}
      </button>
      <button id={styles.dislike} onClick={() => clickedLikeDisLike("dislike")}>
        <span className="material-symbols-outlined">thumb_down</span>
        {evaluationButtonState.dislike.count}
      </button>
      <button id={styles.reply} onClick={onreply}>
        <span className="material-symbols-outlined">reply</span>
        {replyButtonState}
      </button>
    </div>
  ) : (
    <div></div>
  );
}
