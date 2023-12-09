export class game extends Phaser.Scene {
  level: number;
  digit: number;
  number: number;
  second: number;

  constructor() {
    super({
      key: "game",
    });

    //各値の初期化
    this.level = 0;
    this.digit = 0;
    this.number = 0;
    this.second = 0;
  }

  init(data: { level: number; digit: number; number: number; second: number }) {
    this.level = data.level;
    this.digit = data.digit;
    this.number = data.number;
    this.second = data.second;
  }
}
