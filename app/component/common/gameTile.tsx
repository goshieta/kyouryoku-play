import { db } from "@/app/lib/firebase-admin";
import { gameInfoType } from "@/app/lib/types/gameType";
import Link from "next/link";
import styles from "@/app/style/component/gametile.module.css";
import ImageFromFirebase from "./gameImage";

export default async function GameTile({ gameCode }: { gameCode: string }) {
  const gameData = (
    await db.collection("gamesInfo").doc(gameCode).get()
  ).data() as gameInfoType;

  return (
    <Link href={`/games/${gameCode}`} className={styles.gametile}>
      <div id={styles.img_wrapper}>
        <ImageFromFirebase
          path={`gs://kyouryoku-play.appspot.com/games/${gameCode}/promote.webp`}
          width={400}
          height={300}
          alt={`${gameData.promotename}のイメージ画像`}
        />
      </div>
      <h2 id={styles.game_title}>{gameData.promotename}</h2>
      <p id={styles.description_p}>{gameData.explanation}</p>
    </Link>
  );
}
