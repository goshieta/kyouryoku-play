import { db } from "@/app/lib/firebase";
import { gameInfoType } from "@/app/lib/types/gameType";
import styles from "@/app/style/page/game.module.css";

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
    return <div id={styles.game_page}></div>;
  }
}
