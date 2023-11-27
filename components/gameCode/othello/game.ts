export class gameScreen extends Phaser.Scene {
  mode: "player" | "bot";
  board: (0 | 1 | 2)[][];
  scoreArea?: Phaser.GameObjects.DOMElement;
  stoneGraphics?: Phaser.GameObjects.Graphics;
  circleArray: Phaser.GameObjects.GameObject[];

  constructor() {
    super({
      key: "game",
    });
    this.mode = "bot";

    //ボード。黒が1。白が2。先手は黒
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.circleArray = [];
  }

  create() {
    //盤面の初期化
    this.add
      .graphics()
      .fillStyle(0x1aff97, 1)
      .fillRect(
        0,
        0,
        Number(this.game.config.width),
        Number(this.game.config.height)
      );
    //一つのマスは60*60。paddingは10
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        this.add
          .graphics()
          .lineStyle(1, 0x08003f)
          .lineBetween(10, 10 + y * 60, 490, 10 + y * 60);
      }
      this.add
        .graphics()
        .lineStyle(1, 0x08003f)
        .lineBetween(10 + x * 60, 10, 10 + x * 60, 490);
    }

    this.stoneGraphics = this.add.graphics();

    //下のスコア表示など。
    const scoreHTML = `
      <div>
        <div id="blackScoreArea">
          <p>${this.score().black}</p>
        </div>
        <div id="whiteScoreArea">
          <p>${this.score().white}</p>
        </div>
      </div>
    `;
    this.scoreArea = this.add.dom(250, 550).createFromHTML(scoreHTML);
  }
  init(data: { mode: "player" | "bot" }) {
    this.mode = data.mode;
  }

  update(time: number, delta: number): void {
    this.circleArray.forEach((oneCircle) => oneCircle.destroy());
    this.board.map((column, y) => {
      column.map((oneCell, x) => {
        const stoneColorArray = [, 0x000000, 0xffffff];
        this.circleArray.push(
          this.add.circle(
            40 + 60 * x,
            40 + 60 * y,
            20,
            stoneColorArray[oneCell]
          )
        );
      });
    });

    //スコアを更新
    if (this.scoreArea != undefined) {
      ({
        black: this.scoreArea.node.children[0].children[0].innerHTML,
        white: this.scoreArea.node.children[0].children[1].innerHTML,
      } = this.score());
    }
  }

  score() {
    const countStone = (num: number) =>
      String(
        this.board.reduce(
          (accumulator, currentArray) =>
            accumulator +
            currentArray.reduce(
              (columnAccumulator: number, currentValue) =>
                currentValue == num ? columnAccumulator + 1 : columnAccumulator,
              0
            ),
          0
        )
      );
    return {
      black: countStone(1),
      white: countStone(2),
    };
  }

  countTurnOverStone(x: number, y: number, color: number) {
    //ひっくり返せる石の情報を配列で返す
  }
}
