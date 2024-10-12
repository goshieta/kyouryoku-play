import { db } from "@/app/lib/firebase";
import { gameInfoType } from "@/app/lib/types/gameType";
import GameScreen from "@/app/style/component/game/screen";
import styles from "@/app/style/page/game.module.css";
import { Metadata } from "next";

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
          <div id={styles.game_area}>
            <GameScreen
              id={params.gameid}
              width={gameInfo.width}
              height={gameInfo.height}
            />
            <div id={styles.game_operation}>
              <button>報告</button>
              <button>提案</button>
              <button>全画面</button>
            </div>
          </div>
          <div id={styles.game_description}>
            <div id={styles.explanation}>
              <p>プレイ回数 : {gameInfo.played}</p>
              <p>{gameInfo.explanation}</p>
            </div>
            <div id={styles.howtoplay}>
              <p>{gameInfo.howtoplay}</p>
            </div>
          </div>
          <div id={styles.related}></div>
        </div>
      </div>
    );
  }
}
