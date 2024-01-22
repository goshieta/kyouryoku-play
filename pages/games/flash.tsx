import GamePageTemp from "@/components/GamePageTemp";

export default function Flash() {
  return (
    <GamePageTemp
      title="フラッシュ暗算"
      fileName="flash"
      scenes={["top", "game", "gameAnswer", "checkingAnswer"]}
      width={500}
      height={500}
      otherGames={["numguess", "othello", "flyfly", "westeastbuttle"]}
    >
      <h2>遊び方</h2>
      <p>
        フラッシュ暗算とは、画面上に出てくる数字を足し合わせていくゲームです。
      </p>
      <p>
        トップ画面でレベルを選択します。〇桁×口△秒などと書かれていると思いますが、これは〇桁の数字が、△秒に×回出てくるという意味です。この数字を参考にしながら、レベルを選択しましょう。
      </p>
      <p>
        問題は全部で５問出題されます。出題された後は、答え合わせの画面に移ります。ここで自分の実力を実感してください。
      </p>
    </GamePageTemp>
  );
}
