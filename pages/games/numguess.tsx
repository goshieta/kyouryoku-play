import GamePageTemp from "@/components/GamePageTemp";

export default function numguess() {
  return (
    <GamePageTemp
      title="数あてゲーム"
      scenes={["title", "game", "score"]}
      fileName="numguess"
      width={500}
      height={500}
      otherGames={["fishing", "flyfly", "othello", "flash"]}
    >
      <h2>遊び方</h2>
      <p>
        このゲームは指定された数を当てていくゲームです。
        初級は3桁、中級は4桁、上級は5桁となっています。 これらの
        <strong>指定された数には同じ数は含まれていません</strong>。
      </p>
      <p>＊3733（3が重複）などはない</p>
      <p>設定された数を予想し入力した後、OKを押すと判定されます。</p>
      <p>
        この判定には「&#9675;」と「△」があり、
        <strong>&#9675;は数字と位置が一致している個数</strong>、
        <strong>△は数字は一致しているが位置が違う個数</strong>
        を表しています。
      </p>
      <div>
        <p>例 : 設定された数が6385の時、入力した数が</p>
        <p>
          <strong>3</strong>
          940の場合&rarr;&#9675;&thinsp;0&nbsp;△&thinsp;1
        </p>
        <p>＊3が含まれているが位置が違うので△1</p>
        <p>
          9<strong>3</strong>
          <strong>6</strong>
          <strong>5</strong>の場合&rarr;&#9675;&thinsp;2&nbsp;△&thinsp;1
        </p>
        <p>
          ＊6が含まれているが位置が違うので△1。3と5は含まれていて位置も一致しているので&#9675;2。
        </p>
      </div>
      <p></p>
      <p>これらの判定から予測していきます。</p>
    </GamePageTemp>
  );
}
