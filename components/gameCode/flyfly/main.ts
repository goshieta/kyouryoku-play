export class main extends Phaser.Scene {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "main" });

    console.log("ok");
  }
}
