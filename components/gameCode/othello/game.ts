export class gameScreen extends Phaser.Scene {
  mode: "player" | "bot";
  board: (0 | 1 | 2)[][];
  boardForRender: (0 | 1 | 2 | 3)[][];
  scoreArea?: Phaser.GameObjects.DOMElement;
  stoneGraphics?: Phaser.GameObjects.Graphics;
  circleArray: Phaser.GameObjects.GameObject[];
  currentlyPlayer: 1 | 2;
  passCache: number;

  constructor() {
    super({
      key: "game",
    });
    this.mode = "bot";
    this.currentlyPlayer = 1;
    this.passCache = 0;

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
    this.boardForRender = this.putOutSuggestion().boardForRender;

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
      <div id="r_scoreArea">
        <div id="r_blackScoreArea">
          ${this.score().black}
        </div>
        <div id="r_whiteScoreArea">
          ${this.score().white}
        </div>
      </div>
      <style>
        #r_scoreArea{
          display:flex;
          gap:20px;
        }
        #r_scoreArea > div{
          width:80px;
          height:40px;
          display:flex;
          justify-content:center;
          align-items:center;
          border-radius:2px;
          font-size:20px;
          font-weight:bold;
          box-sizing:border-box;
        }
        #r_blackScoreArea{
          background-color:black;
          color:white;
        }
        #r_whiteScoreArea{
          background-color:white;
        }
      </style>
    `;
    this.scoreArea = this.add.dom(250, 550).createFromHTML(scoreHTML);
  }
  init(data: { mode: "player" | "bot" }) {
    this.mode = data.mode;
  }

  update(time: number, delta: number): void {
    //レンダリング
    this.circleArray.forEach((oneCircle) => oneCircle.destroy());
    let numberOfCanTurnOver = 0;
    this.boardForRender.map((column, y) => {
      column.map((oneCell, x) => {
        const stoneColorArray = [, 0x000000, 0xffffff];
        if (oneCell === 3) {
          numberOfCanTurnOver++;
          this.circleArray.push(
            this.add.circle(
              40 + 60 * x,
              40 + 60 * y,
              5,
              stoneColorArray[this.currentlyPlayer]
            )
          );
        } else {
          this.circleArray.push(
            this.add.circle(
              40 + 60 * x,
              40 + 60 * y,
              20,
              stoneColorArray[oneCell]
            )
          );
        }
      });
    });
    if (numberOfCanTurnOver == 0) {
      this.pass();
      this.passCache++;
    } else {
      this.passCache = 0;
    }

    //スコアを更新
    if (this.scoreArea != undefined) {
      const scoreAreaParentDiv = this.scoreArea.node.children[0];
      ({
        black: scoreAreaParentDiv.children[0].innerHTML,
        white: scoreAreaParentDiv.children[1].innerHTML,
      } = this.score());
    }

    if (this.passCache >= 2) {
      //パスが二回以上繰り返されたということなので、両方とも置けない。よってゲーム終了
      this.gameEnd();
    }

    //入力イベントの検出
    const pointer = this.input.activePointer;
    if (pointer.isDown) {
      if (
        10 < pointer.x &&
        pointer.x < 490 &&
        10 < pointer.y &&
        pointer.y < 490
      ) {
        //範囲内にポインターがある場合
        const positionOfMass = {
          x: Math.floor((pointer.x - 10) / 60),
          y: Math.floor((pointer.y - 10) / 60),
        };
        this.turnStone(positionOfMass.x, positionOfMass.y);
      }
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
                currentValue === num
                  ? columnAccumulator + 1
                  : columnAccumulator,
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

  countTurnOverStone(x: number, y: number, currentColor: 1 | 2) {
    //currentColorはいひっくり返す側のプレイヤー
    //ひっくり返せる石の情報を配列で返す
    //方向をfor文で定めて、それぞれの方向に盤面上でループする。
    let canTurnOverStone: number[][] = [];
    for (let xDir = -1; xDir <= 1; xDir++) {
      for (let yDir = -1; yDir <= 1; yDir++) {
        //方向0,0はその場にとどまり続けるのではじく
        if (xDir === 0 && yDir === 0) continue;
        //ループ中に現在の位置を把握させる
        let currentPosition = [x, y];
        let canTurnOverStoneOnOneDirection: number[][] = [];

        currentPosition = [
          currentPosition[0] + xDir,
          currentPosition[1] + yDir,
        ];

        while (
          this.board[currentPosition[1]] !== undefined &&
          this.board[currentPosition[1]][currentPosition[0]] ==
            (currentColor == 1 ? 2 : 1)
        ) {
          canTurnOverStoneOnOneDirection.push(currentPosition);
          currentPosition = [
            currentPosition[0] + xDir,
            currentPosition[1] + yDir,
          ];
          if (this.board[currentPosition[1]] == undefined) break;
        }

        //while文が終わっていた時の位置が範囲を超えていた場合、自分の石がなかったということなので、ひっくり返せない。
        if (
          currentPosition[0] < 0 ||
          7 < currentPosition[0] ||
          currentPosition[1] < 0 ||
          7 < currentPosition[1]
        )
          canTurnOverStoneOnOneDirection = [];
        //何もないところで終わっていた場合、自分の石がなかったということなのでひっくり返せない
        if (
          this.board[currentPosition[1]] === undefined ||
          this.board[currentPosition[1]][currentPosition[0]] === 0
        )
          canTurnOverStoneOnOneDirection = [];

        canTurnOverStone = canTurnOverStone.concat(
          canTurnOverStoneOnOneDirection
        );
      }
    }

    return canTurnOverStone;
  }

  putOutSuggestion() {
    //boardForRender用の配列と、単純における場所の座標を書いた配列を返す。
    let arrayOfCanTurnOver: number[][][] = [];
    const boardForRender = this.board.map((row, y) =>
      row.map((oneStone, x) => {
        if (oneStone != 0) return oneStone;
        const info = this.countTurnOverStone(x, y, this.currentlyPlayer);
        arrayOfCanTurnOver.push(info);
        return info.length == 0 ? 0 : 3;
      })
    );
    return {
      boardForRender: boardForRender,
      arrayOfCanTurnOver: arrayOfCanTurnOver,
    };
  }

  turnStone(x: number, y: number) {
    if (this.boardForRender[y][x] !== 3) return;
    let turnStoneArray = [[x, y]];
    turnStoneArray = turnStoneArray.concat(
      this.countTurnOverStone(x, y, this.currentlyPlayer)
    );
    turnStoneArray.forEach((position) => {
      this.board[position[1]][position[0]] = this.currentlyPlayer;
    });
    this.currentlyPlayer = this.currentlyPlayer === 1 ? 2 : 1;
    this.boardForRender = this.putOutSuggestion().boardForRender;
  }

  pass() {
    //パスを実装
    this.currentlyPlayer = this.currentlyPlayer === 1 ? 2 : 1;
    this.boardForRender = this.putOutSuggestion().boardForRender;
  }

  gameEnd() {
    console.log("end!");
    this.scene.start("gameEnd", this.score);
  }
}
