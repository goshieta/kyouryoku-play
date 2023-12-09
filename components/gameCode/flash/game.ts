export class game extends Phaser.Scene {
  level: number;
  digit: number;
  number: number;
  second: number;
  currentNumber: number;
  problemCache: { userAnswer: number; correctAnswer: number }[];
  mainText?: Phaser.GameObjects.Text;
  currentTime: number;
  problem: number[];

  constructor() {
    super({
      key: "game",
    });

    //各値の初期化
    this.level = 0;
    this.digit = 0;
    this.number = 0;
    this.second = 0;
    this.currentNumber = 0;
    this.problemCache = [];
    this.currentTime = 0;
    this.problem = [];
  }

  init(data: {
    level: number;
    digit: number;
    number: number;
    second: number;
    currentNumber: number;
    cache: { userAnswer: number; correctAnswer: number }[];
  }) {
    this.level = data.level;
    this.digit = data.digit;
    this.number = data.number;
    this.second = data.second;
    this.currentNumber = data.currentNumber;
    this.problemCache = data.cache;

    //問題作成
    for (let i = 0; i < this.number; i++) {
      //最初に5桁生成して、桁数に応じて、切り捨てる。
      let thisNumber = 0;
      do {
        thisNumber = Math.floor(
          (Math.random() * 89999 + 10000) / 10 ** (5 - this.digit)
        );
      } while (thisNumber === this.problem[i - 1]);

      this.problem.push(thisNumber);
    }
  }

  create() {
    this.mainText = this.add
      .text(250, 250, `第${this.currentNumber}問`, {
        fontSize: 70,
        fontFamily: "Zen Kaku Gothic New",
      })
      .setOrigin(0.5);
  }

  update(time: number, delta: number): void {
    this.currentTime += delta;
    if (this.currentTime < 1000) return;
    if (this.mainText === undefined) return;
    const currentProblemElement =
      this.problem[
        Math.floor(
          (this.currentTime - 1000) / ((this.second * 1000) / this.number)
        )
      ];

    if (currentProblemElement === undefined) {
      this.scene.start("gameAnswer", {
        level: this.level,
        digit: this.digit,
        number: this.number,
        second: this.second,
        currentNumber: this.currentNumber,
        cache: this.cache,
        correctNumber: this.problem.reduce(
          (previousValue, currentValue) => previousValue + currentValue
        ),
      });
      return;
    }

    this.mainText.text = String(currentProblemElement);
  }
}
