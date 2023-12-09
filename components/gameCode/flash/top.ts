export default class top extends Phaser.Scene {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "top" });
  }
  create() {
    const backGround = this.add.graphics();
    backGround.fillStyle(0x000000, 1);
    backGround.fillRect(
      0,
      0,
      Number(this.game.config.width),
      Number(this.game.config.height)
    );

    const topFormCode = ``;
    const topFormDom = this.add.dom(250, 250).createFromHTML(topFormCode);
  }
}
