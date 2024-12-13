import { db } from "@/app/lib/firebase-admin";
import { gameInfoType } from "@/app/lib/types/gameType";
import styles from "@/app/style/page/game.module.css";
import { Metadata } from "next";
import GameArea from "@/app/component/game/gameArea";
import GameTile from "@/app/component/common/gameTile";

export const generateMetadata = async ({
  params,
}: {
  params: { gameid: string };
}): Promise<Metadata> => {
  const gameRef = db.collection("gamesInfo").doc(params.gameid);
  const gameInfo = await gameRef
    .get()
    .then((doc) => doc.data() as gameInfoType | undefined);
  if (!gameInfo) {
    return {
      title: "存在しないゲーム - 峡緑プレイ",
    };
  } else {
    return {
      title: `${gameInfo.promotename} - 峡緑プレイ`,
      description: gameInfo.explanation,
    } as Metadata;
  }
};

export default async function GamePage({
  params,
}: {
  params: { gameid: string };
}) {
  const gameRef = db.collection("gamesInfo").doc(params.gameid);
  const gameInfo = await gameRef
    .get()
    .then((doc) => doc.data() as gameInfoType | undefined);
  if (!gameInfo) {
    return (
      <div>
        <h1>４０４：存在しないページ</h1>
      </div>
    );
  } else {
    return (
      <div id={styles.game_page}>
        <div id={styles.content}>
          <GameArea gameInfo={gameInfo} />
          <div id={styles.game_description}>
            <div id={styles.game_overview}>
              <h1 id={styles.game_title}>{gameInfo.name}</h1>
              <div id={styles.statistics}>
                <div>
                  <span className="material-symbols-outlined">
                    sports_esports
                  </span>
                  <p>{gameInfo.played} 回</p>
                </div>
              </div>
            </div>
            <div id={styles.explanation}>
              <p>{gameInfo.explanation}</p>
            </div>
            <div id={styles.howtoplay}>
              <p>{gameInfo.howtoplay}</p>
            </div>
          </div>
        </div>
        <div id={styles.related}>
          <div id={styles.games}>
            {gameInfo.recommend.map((id) => (
              <GameTile gameCode={id} key={id}></GameTile>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
