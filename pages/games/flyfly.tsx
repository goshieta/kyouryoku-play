import GamePageTemp from "@/components/GamePageTemp";

export default function FlyFly() {
  return (
    <GamePageTemp
      title="Fly Fly"
      scenes={["main"]}
      fileName="flyfly"
      width={800}
      height={600}
      otherGames={["othello", "flash"]}
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
    </GamePageTemp>
  );
}
