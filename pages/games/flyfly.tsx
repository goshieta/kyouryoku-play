import GamePageTemp from "@/components/GamePageTemp";

export default function FlyFly() {
  return (
    <GamePageTemp
      title="Fly Fly"
      scenes={["main"]}
      fileName="flyfly"
      width={800}
      height={600}
      otherGames={["othello", "flash", "fishing"]}
      additionalConfig={{
        physics: {
          default: "arcade",
          arcade: {
            gravity: {
              y: 500,
            },
          },
        },
      }}
    >
      <h2>遊び方</h2>
      <p>
        隕石をよけながら、できるだけ多くの星をとっていくゲームです。操作はクリックで行います。
      </p>
      <p>
        クリックすると、機体が浮かびます。この宇宙船をうまく操作して、隕石をできるだけよけるようにして、星をとります。
      </p>
      <p>
        矢印マークのアイテムはとると、スピードが速くなります。より多くの星を短時間にとれるようになりますが、相対的に隕石にぶつかるリスクも高くなります。そのためうまく考えながら、とるようにしましょう。
      </p>
    </GamePageTemp>
  );
}
