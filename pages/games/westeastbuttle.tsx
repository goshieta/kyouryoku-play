import GamePageTemp from "@/components/GamePageTemp";

export default function westeastbuttle() {
  return (
    <GamePageTemp
      title="東西大決戦"
      scenes={["title", "game", "score"]}
      fileName="westeastbuttle"
      width={800}
      height={600}
      otherGames={["flash", "numguess", "othello", "flyfly"]}
      additionalConfig={{
        physics: {
          default: "arcade",
          arcade: {
            gravity: {},
          },
        },
        dom: {
          createContainer: true,
        },
      }}
    >
      <h2>遊び方</h2>
    </GamePageTemp>
  );
}
