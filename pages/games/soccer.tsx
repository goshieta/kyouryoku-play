import GamePageTemp from "@/components/GamePageTemp";

export default function soccer() {
  return (
    <GamePageTemp
      title="ヘマヘマサッカー"
      fileName="soccer"
      width={800}
      height={600}
      additionalConfig={{
        physics: {
          default: "matter",
          matter: {
            gravity: {
              x: 0,
              y: 0,
            },
          },
        },
      }}
      scenes={["load", "top", "game", "score"]}
      otherGames={["castlerun", "numguess", "flyfly", "westeastbuttle"]}
    >
      <h2>遊び方</h2>
      <p>
        このゲームは無料の２人用サッカーゲームです。１人でも遊ぶことができます。
      </p>
      <p>
        このゲームの目的は相手のゴールにより多くボールを入れることで、先に５点をとったほうが勝ちとなります。プレイヤーは止まっているときは回転し、画面をクリックすることで、直進します。
      </p>
      <p>
        そのためプレイヤーとボールとゴールの角度をうまく見極めて、操作する必要があり難易度は高めとなっています。
      </p>
      <p>
        操作は画面タッチ、パソコンの場合はqキー、pキーを押すことでも操作できます。
      </p>
      <p>
        一人でプレイするときは赤のプレイヤーを操作し、二人プレイの時は左側を押すと赤、右側を押すと青のプレイヤーを操作できます。
      </p>
    </GamePageTemp>
  );
}
