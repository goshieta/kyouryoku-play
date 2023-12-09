import GamePageTemp from "@/components/GamePageTemp";

export default function Flash() {
  return (
    <GamePageTemp
      title="フラッシュ暗算"
      fileName="flash"
      scenes={["top", "game"]}
      width={500}
      height={500}
      otherGames={["othello"]}
    >
      <h2>遊び方</h2>
      <p>
        フラッシュ暗算とは、画面上に出てくる数字を足し合わせていくゲームです。
      </p>
    </GamePageTemp>
  );
}
