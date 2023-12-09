export default class gameAnswer extends Phaser.Scene {
  constructor() {
    super({
      key: "gameAnswer",
    });
  }
  init(data: {
    level: number;
    digit: number;
    number: number;
    second: number;
    currentNumber: number;
    cache: { userAnswer: number; correctAnswer: number }[];
    correctNumber: number;
  }) {}
}
