"use client";

import GameScreen from "@/app/component/game/screen";
import { gameInfoType } from "@/app/lib/types/gameType";
import styles from "@/app/style/page/game.module.css";
import { useCallback, useState } from "react";

export default function GameArea({ gameInfo }: { gameInfo: gameInfoType }) {
  const share = useCallback(async () => {
    const shareData = {
      title: gameInfo.promotename,
      text: gameInfo.catchcopy,
      url: window.location.href,
    };
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      console.log("シェア完了");
    } else {
      console.log("シェアできんわ。");
    }
  }, []);

  const [isFull, setIsFull] = useState(false);

  return (
    <div id={styles.game_area}>
      <GameScreen
        id={gameInfo.id}
        width={gameInfo.width}
        height={gameInfo.height}
        isFull={isFull}
        closeFull={() => setIsFull(false)}
      />
      <div id={styles.game_operation}>
        {typeof navigator === "object" &&
          typeof navigator.share === "function" && (
            <button onClick={share}>
              <span className="material-symbols-outlined">share</span>
              共有
            </button>
          )}
        <button
          onClick={() =>
            window.open("https://forms.gle/cA4Gj4yw7TpvWa787", "_blank")
          }
        >
          <span className="material-symbols-outlined">report</span>
          報告
        </button>
        <button
          onClick={() =>
            window.open("https://forms.gle/koB9KyN9biwiD3BUA", "_blank")
          }
        >
          <span className="material-symbols-outlined">front_hand</span>
          提案
        </button>
        <button id={styles.fullscreen_button} onClick={() => setIsFull(true)}>
          <span className="material-symbols-outlined">fullscreen</span>
          全画面
        </button>
      </div>
    </div>
  );
}
