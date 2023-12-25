import GamePageTemp from "@/components/GamePageTemp";

export default function fishing() {
  return (
    <GamePageTemp
      title="水魚金"
      fileName="fishing"
      scenes={["title", "map"]}
      width={900}
      height={600}
      otherGames={["othello", "flyfly", "numguess", "flash"]}
      additionalConfig={{
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: false,
          },
        },
      }}
    >
      <h2>ゲームの概要</h2>
      <p>このゲームは、魚を捕って、売りさばき、億万長者になるゲームです。</p>
      <p>
        ゲーム内には様々な地域があります。それらの地域を天候や、時期などに応じて渡り歩き、様々な魚を取ります。そして、その魚を町に行って売ることで収入を得ましょう。
      </p>
      <h2>遊び方</h2>
    </GamePageTemp>
  );
}
