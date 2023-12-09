import GamePageTemp from "@/components/GamePageTemp";

export default function Flash() {
  return (
    <GamePageTemp
      title="フラッシュ暗算"
      fileName="flash"
      scenes={[]}
      width={500}
      height={500}
      otherGames={[]}
    >
      <h2>遊び方</h2>
      <p>
        フラッシュ暗算とは、画面上に出てくる数字を足し合わせていくゲームです。
      </p>
    </GamePageTemp>
  );
}
