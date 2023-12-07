import GamePageTemp from "@/components/GamePageTemp";
import { useEffect, useState } from "react";

export default function Othello() {
  const [sceneArray, setSceneArray] = useState<any>([]);

  useEffect(() => {
    const readScenes = async () => {
      const titleScreen = await import(
        "@/components/gameCode/othello/titleScreen"
      );
      const gameScreen = await import("@/components/gameCode/othello/game");
      const gameEndScreen = await import(
        "@/components/gameCode/othello/gameEnd"
      );
      setSceneArray([
        titleScreen.titleScreen,
        gameScreen.gameScreen,
        gameEndScreen.gameEnd,
      ]);
    };

    readScenes();
  }, []);

  return (
    <GamePageTemp
      title="オセロ（リバーシ）"
      scenes={sceneArray}
      width={500}
      height={600}
      otherGames={[
        {
          title: "将棋",
          link: "/",
        },
        {
          title: "囲碁",
          link: "/",
        },
        {
          title: "フラッシュ暗算",
          link: "/",
        },
        {
          title: "コネクト４",
          link: "/",
        },
      ]}
    >
      <h2>遊び方</h2>
      <p>シンプルな普通のオセロです。</p>
      <p>
        黒と白の二種類の石があり、プレイヤーは黒から交互に石を打ちます。自分の石で、敵の石をはさむと、その石は自分の石にすることができます。
      </p>
      <p>最終的に石の数が多いほうがこのゲームの勝者となります。</p>
    </GamePageTemp>
  );
}
