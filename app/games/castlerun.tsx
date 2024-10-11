import GamePageTemp from "@/components/GamePageTemp";

export default function Castlerun() {
  return (
    <GamePageTemp
      title="走る城"
      fileName="castlerun"
      width={800}
      height={600}
      otherGames={["soccer", "flyfly", "westeastbuttle", "flash"]}
      additionalConfig={{
        physics: {
          default: "arcade",
          arcade: {
            gravity: {
              y: 500,
            },
          },
        },
        render: {
          pixelArt: true,
        },
      }}
      scenes={["load", "game"]}
    >
      <h2>遊び方</h2>
      <p>このゲームはホラーゲーム風のアクションゲームです。</p>
      <p>
        プレイヤーはかぼちゃのキャラクターを操作して、できるだけ長い間走ることを目指します。
      </p>
      <p>
        かぼちゃのキャラクターは壁にぶつかると死亡します。壁にはランダムな位置に穴が開いており、その穴の高さに合わせて1～5のボタン（もしくはキー）を押してジャンプします。
      </p>
      <p>
        押したボタンの数に応じた高さ分プレイヤーはジャンプします。つまり、1が一番低いジャンプで5が一番高いジャンプということです。
      </p>
      <p>スコアは進んだ距離に応じて増えます。</p>
    </GamePageTemp>
  );
}
