"use client";

import styles from "@/app/style/page/game.module.css";
import { useState } from "react";

export default function GameScreen({
  id,
  width,
  height,
}: {
  id: string;
  width: number;
  height: number;
}) {
  const [isberow, setIsberow] = useState(false);

  return (
    <div id={styles.game_screen}>
      <div
        id={styles.start_screen}
        style={{
          display: isberow ? "none" : "flex",
          width: width,
          height: height,
        }}
      >
        <img src={`/api/games/${id}/promote.webp`} alt={`${id}の画像`} />
        <button onClick={() => setIsberow(true)}>クリックでプレイ</button>
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
  );
}
