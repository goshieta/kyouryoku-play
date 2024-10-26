import styles from "@/app/style/page/game.module.css";
import { useState } from "react";

export default function GameScreen({
  id,
  width,
  height,
  isFull,
  closeFull,
}: {
  id: string;
  width: number;
  height: number;
  isFull: boolean;
  closeFull: () => void;
}) {
  const [isberow, setIsberow] = useState(false);

  const windowAspect =
    typeof window === "undefined" ? 1 : window.innerWidth / window.innerHeight;
  const gameScreenAspect = width / height;

  const calcedWidth = isFull
    ? windowAspect > gameScreenAspect
      ? window.innerHeight * gameScreenAspect
      : window.innerWidth // フルスクリーンのクライアントサイド、ウィンドウのアスペクト比とゲーム画面のアスペクト比をもとに、widthを決定する
    : width; //通常状態

  return (
    <div id={styles.fullscreen_wraper} className={isFull ? styles.full : ""}>
      <button
        onClick={closeFull}
        id={styles.close_full}
        className={isFull ? styles.full : ""}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <div
        id={styles.game_screen}
        style={{
          width: calcedWidth,
          aspectRatio: width / height,
        }}
        className={isFull ? styles.full : ""}
      >
        <div
          id={styles.start_screen}
          style={{ display: isberow ? "none" : "flex" }}
        >
          <img
            src={`/api/games/${id}/promote.webp`}
            alt={`${id}の画像`}
            id={styles.start_screen_back}
          />
          <button onClick={() => setIsberow(true)}>
            <img
              src="/navigation/playbutton.svg"
              alt="あそぼーよ！"
              width={150}
              height={150}
            />
          </button>
        </div>
        <iframe
          src={`/api/games/${id}/index.html`}
          loading="lazy"
          width={width}
          height={height}
          id={styles.screen_iframe}
          style={{ display: isberow ? "block" : "none" }}
        ></iframe>
      </div>
    </div>
  );
}
