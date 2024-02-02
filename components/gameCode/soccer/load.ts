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
    this.load.image("back", "/assets/soccer/image/back.png");
    this.load.image("ball", "/assets/soccer/image/ball.png");
    this.load.image("blue", "/assets/soccer/image/blue.png");
    this.load.image("red", "/assets/soccer/image/red.png");
    this.load.image("goal", "/assets/soccer/image/goal.png");

    this.load.audio("backsound", "/assets/soccer/sound/backsound.mp3");
    this.load.audio("cheer", "/assets/soccer/sound/cheer.mp3");
  }
}
