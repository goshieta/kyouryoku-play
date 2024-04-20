import { useAuth } from "@/components/context/auth";
import { db } from "@/lib/firebase/client";
import { reactionType } from "@/lib/types/communityType";
import createUUID from "@/lib/uuid";
import styles from "@/styles/world/world.module.css";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
  QueryDocumentSnapshot,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  getCountFromServer,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [evaluationButtonState, setEvaluationButtonState] = useState<
    | {
        like: { count: number; isClicked: boolean };
        dislike: { count: number; isClicked: boolean };
      }
    | undefined
  >(undefined);
  const [replyButtonState, setReplyButtonState] = useState(reply);
  const authInfo = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authInfo) return;
    //即時関数で非同期を実現
    (async function () {
      const likeSnapShot = getDocs(
        query(
          collection(db, "evaluation"),
          where("user", "==", authInfo.id),
          where("target", "==", messageId),
          where("type", "==", "like")
        )
      );
      const dislikeSnapShot = getDocs(
        query(
          collection(db, "evaluation"),
          where("user", "==", authInfo.id),
          where("target", "==", messageId),
          where("type", "==", "dislike")
        )
      );
      const haveLike: QueryDocumentSnapshot<DocumentData, DocumentData> = (
        await likeSnapShot
      ).docs[0];
      const haveDisLike: QueryDocumentSnapshot<DocumentData, DocumentData> = (
        await dislikeSnapShot
      ).docs[0];
      setEvaluationButtonState({
        like: { count: like, isClicked: haveLike ? true : false },
        dislike: { count: dislike, isClicked: haveDisLike ? true : false },
      });
    })();
  }, [authInfo]);

  const clickedLikeDisLike = useCallback(
    (type: "like" | "dislike") => {
      if (!evaluationButtonState) return;
      if (!evaluationButtonState[type].isClicked) {
        //登録
        const opposition = type === "like" ? "dislike" : "like";
        setEvaluationButtonState({
          ...evaluationButtonState,
          [type]: {
            count: evaluationButtonState[type].count + 1,
            isClicked: true,
          },
          [opposition]: {
            count: evaluationButtonState[opposition].isClicked
              ? evaluationButtonState[opposition].count - 1
              : evaluationButtonState[opposition].count,
            isClicked: false,
          },
        });
      } else {
        //登録解除
        setEvaluationButtonState({
          ...evaluationButtonState,
          [type]: {
            count: evaluationButtonState[type].count - 1,
            isClicked: false,
          },
        });
      }
      postEvaluation(
        !evaluationButtonState[type].isClicked
          ? { ...{ like: false, dislike: false }, [type]: true }
          : { like: false, dislike: false }
      );
    },
    [evaluationButtonState, authInfo]
  );

  const currentlyPostServerProcessID = useRef<string | null>(null);
  //サーバーの処理
  const postEvaluation = useCallback(
    (newState: { like: boolean; dislike: boolean }) => {
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
        const likeSnapShot = getDocs(
          query(
            collection(db, "evaluation"),
            where("user", "==", authInfo.id),
            where("target", "==", messageId),
            where("type", "==", "like")
          )
        );
        const dislikeSnapShot = getDocs(
          query(
            collection(db, "evaluation"),
            where("user", "==", authInfo.id),
            where("target", "==", messageId),
            where("type", "==", "dislike")
          )
        );
        const like:
          | QueryDocumentSnapshot<DocumentData, DocumentData>
          | undefined = (await likeSnapShot).docs[0];
        const dislike:
          | QueryDocumentSnapshot<DocumentData, DocumentData>
          | undefined = (await dislikeSnapShot).docs[0];
        //likeとdislikeは存在するか存在しないか
        //それと、現在のクライアントサイドのステートを照合する。
        //その後差分を変更する
        const stateAll = {
          client: newState,
          server: {
            like: like ? true : false,
            dislike: dislike ? true : false,
          },
        };
        if (stateAll.client.like !== stateAll.server.like) {
          //好きを消したり、追加したりする
          if (stateAll.client.like) {
            const reaction: reactionType = {
              id: createUUID(),
              user: authInfo.id,
              target: messageId,
              type: "like",
            };
            await setDoc(doc(db, "evaluation", reaction.id), reaction);
          } else {
            const docId = like.id;
            await deleteDoc(doc(db, "evaluation", docId));
          }
        }
        if (stateAll.client.dislike !== stateAll.server.dislike) {
          //嫌いを消したり、追加したりする
          if (stateAll.client.dislike) {
            const reaction: reactionType = {
              id: createUUID(),
              user: authInfo.id,
              target: messageId,
              type: "dislike",
            };
            await setDoc(doc(db, "evaluation", reaction.id), reaction);
          } else {
            const docId = dislike.id;
            await deleteDoc(doc(db, "evaluation", docId));
          }
        }
        //likeとdislikeの値を更新する
        const likeNumber = (
          await getCountFromServer(
            query(
              collection(db, "evaluation"),
              where("target", "==", messageId),
              where("type", "==", "like")
            )
          )
        ).data().count;
        const dislikeNumber = (
          await getCountFromServer(
            query(
              collection(db, "evaluation"),
              where("target", "==", messageId),
              where("type", "==", "dislike")
            )
          )
        ).data().count;
        updateDoc(doc(db, "world", messageId), {
          like: likeNumber,
          dislike: dislikeNumber,
        });
      }, timeout);
    },
    [evaluationButtonState, authInfo]
  );

  const onreply = useCallback(() => {
    //replyする
    router.push(`/world/new?type=reply&target=${messageId}`);
  }, [router]);

  return evaluationButtonState ? (
    <div id={styles.reaction}>
      <button
        id={styles.like}
        onClick={() => clickedLikeDisLike("like")}
        className={
          evaluationButtonState.like.isClicked
            ? styles.reactionButtonHasClicked
            : ""
        }
      >
        <span className="material-symbols-outlined">thumb_up</span>
        {evaluationButtonState.like.count}
      </button>
      <button
        id={styles.dislike}
        onClick={() => clickedLikeDisLike("dislike")}
        className={
          evaluationButtonState.dislike.isClicked
            ? styles.reactionButtonHasClicked
            : ""
        }
      >
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
