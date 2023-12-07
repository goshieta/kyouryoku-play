export class gameEnd extends Phaser.Scene {
  lastScore: {
    black: number;
    white: number;
  };

  constructor() {
    super({
      key: "gameEnd",
    });

    this.lastScore = {
      black: 0,
      white: 0,
    };
  }

  init(data: { black: string; white: string }) {
    this.lastScore = { white: Number(data.white), black: Number(data.black) };
  }
}
