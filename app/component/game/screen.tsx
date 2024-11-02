import styles from "@/app/style/page/game.module.css";
import { useState } from "react";
import { doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import ImageFromFirebase from "../common/gameImage";

export default function GameScreen({
  id,
  width,
  height,
  isFull,
  imgPath,
  closeFull,
}: {
  id: string;
  width: number;
  height: number;
  isFull: boolean;
  imgPath: string;
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

  const handlePlay = () => {
    setIsberow(true);

    //プレイ回数を1増やす
    updateDoc(doc(db, `gamesInfo/${id}`), { played: increment(1) });
  };

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
        <div id={styles.back_loading}>
          <div></div>
        </div>
        <div
          id={styles.start_screen}
          style={{ display: isberow ? "none" : "flex" }}
        >
          <ImageFromFirebase
            path={imgPath}
            alt={`${id}のプロモーション用画像`}
            width="100%"
            height="100%"
          />
          <button onClick={handlePlay}>
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
