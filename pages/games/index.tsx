import GameTile from "@/components/GameTile";
import Head from "next/head";
import styles from "@/styles/pages/gameTop.module.css";

export default function GameTop() {
  const games = [
    "soccer",
    "westeastbuttle",
    "castlerun",
    "numguess",
    "flyfly",
    "flash",
    "othello",
  ];
  return (
    <div id={styles.top}>
      <Head>
        <title>すべてのゲーム - 峡緑プレイ</title>
      </Head>
      <h1>すべてのゲーム</h1>
      <div id={styles.games}>
        {games.map((gameName) => (
          <GameTile gameCode={gameName} key={gameName} />
        ))}
      </div>
    </div>
  );
}
