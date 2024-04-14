import styles from "@/styles/world/world.module.css";
import { useState } from "react";

export default function Reaction({
  like,
  dislike,
  reply,
}: {
  like: number;
  dislike: number;
  reply: number;
}) {
  const [buttonState, setButtonState] = useState<{
    like: { count: number; isClicked: boolean };
    dislike: { count: number; isClicked: boolean };
    reply: { count: number; isClicked: boolean };
  }>({
    like: { count: like, isClicked: false },
    dislike: { count: dislike, isClicked: false },
    reply: { count: reply, isClicked: false },
  });

  const clickedLikeDisLike = (type: "like" | "dislike") => {
    if (!buttonState[type].isClicked) {
      //登録
      setButtonState({
        ...buttonState,
        [type]: { count: buttonState[type].count + 1, isClicked: true },
      });
    } else {
      //登録解除
      setButtonState({
        ...buttonState,
        [type]: { count: buttonState[type].count - 1, isClicked: false },
      });
    }
  };

  return (
    <div id={styles.reaction}>
      <button
        id={styles.like}
        onClick={() => clickedLikeDisLike("like")}
        className={
          buttonState.like.isClicked ? styles.reactionButtonHasClicked : ""
        }
      >
        <span className="material-symbols-outlined">thumb_up</span>
        {buttonState.like.count}
      </button>
      <button
        id={styles.dislike}
        onClick={() => clickedLikeDisLike("dislike")}
        className={
          buttonState.dislike.isClicked ? styles.reactionButtonHasClicked : ""
        }
      >
        <span className="material-symbols-outlined">thumb_down</span>
        {buttonState.dislike.count}
      </button>
      <button id={styles.reply}>
        <span className="material-symbols-outlined">reply</span>
        {buttonState.reply.count}
      </button>
    </div>
  );
}
