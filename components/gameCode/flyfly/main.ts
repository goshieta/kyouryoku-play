export class main extends Phaser.Scene {
  player?: Phaser.GameObjects.Sprite;

  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "main" });
  }
  preload() {
    this.load.image("plane", "/chara/flyfly/飛行機.svg");
  }
  create() {
    //背景
    this.add.rectangle(400, 300, 800, 600, 0x3c006e);

    //メインオブジェクト
    this.player = this.add.sprite(100, 300, "plane").setDisplaySize(100, 100);
  }
}
