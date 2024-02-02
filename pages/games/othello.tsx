import GamePageTemp from "@/components/GamePageTemp";

export default function Othello() {
  return (
    <GamePageTemp
      title="オセロ（リバーシ）"
      fileName="othello"
      scenes={["titleScreen", "game", "gameEnd"]}
      width={500}
      height={600}
      otherGames={["numguess", "westeastbuttle", "flyfly", "soccer"]}
    >
      <h2>遊び方</h2>
      <p>シンプルな二人プレイ用のオセロです。</p>
      <p>
        黒と白の二種類の石があり、プレイヤーは黒から交互に石を打ちます。自分の石で、敵の石をはさむと、その石は自分の石にすることができます。
      </p>
      <p>最終的に石の数が多いほうがこのゲームの勝者となります。</p>
    </GamePageTemp>
  );
}
