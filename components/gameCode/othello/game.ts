export class gameScreen extends Phaser.Scene {
  mode: "player" | "bot";
  constructor() {
    super({
      key: "game",
    });
    this.mode = "bot";
  }
  create() {
    //盤面の初期化
    this.add
      .graphics()
      .fillStyle(0x24ad52, 1)
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
          .lineStyle(2, 0x000000)
          .lineBetween(10, 10 + y * 60, 490, 10 + y * 60);
      }
      this.add
        .graphics()
        .lineStyle(2, 0x000000)
        .lineBetween(10 + x * 60, 10, 10 + x * 60, 490);
    }
  }
  init(data: { mode: "player" | "bot" }) {
    this.mode = data.mode;
  }
}
