export class load extends Phaser.Scene {
  private loadingText?: Phaser.GameObjects.Text;

  constructor() {
    super("load");
  }
  preload() {
    this.loadingText = this.add.text(80, 80, "0% loading...", {});

    // 進捗バーを更新するイベント
    this.load.on("progress", (loaded: number) => {
      this.loadingText?.setText(`${Math.floor(loaded * 100)}% loading...`);
    });
    // 全てのファイルのロード処理が完了した時のイベント
    this.load.on("complete", () => {
      this.scene.start("game");
    });

    //ロード
    this.load.image(
      "mossyStoneBricks",
      "/assets/castlerun/image/mossyStoneBricks.png"
    );
    this.load.image("stoneBricks", "/assets/castlerun/image/stoneBricks.png");
    this.load.image("torch", "/assets/castlerun/image/torch.png");

    this.load.spritesheet("player", "/assets/castlerun/image/pumpkin.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("back", "/assets/castlerun/sound/back.mp3");
    this.load.audio("damage", "/assets/castlerun/sound/damage.mp3");
    this.load.audio("jump", "/assets/castlerun/sound/jump.mp3");
  }
}
