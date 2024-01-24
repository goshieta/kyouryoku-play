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
      this.scene.start("title");
    });

    //ロード
    this.load.html("mainHTML", "/chara/westeastbuttle/title.html");

    this.load.svg("me", "/chara/westeastbuttle/me.svg", {
      width: 50,
      height: 50,
    });
    this.load.svg("you", "/chara/westeastbuttle/you.svg", {
      width: 50,
      height: 50,
    });
    this.load.svg("crown", "/chara/westeastbuttle/crown.svg", {
      width: 40,
      height: 40,
    });

    const itemArray = ["protect", "recovery", "speedup", "stalker"];
    this.load.image(
      itemArray.map((key) => {
        return { key: key, url: `/chara/westeastbuttle/items/${key}.png` };
      })
    );

    this.load.audio([
      { key: "don", url: "/chara/westeastbuttle/sound/don.mp3" },
      { key: "dodon", url: "/chara/westeastbuttle/sound/dodon.mp3" },
      { key: "damage", url: "/chara/westeastbuttle/sound/damage.mp3" },
      { key: "get", url: "/chara/westeastbuttle/sound/get.mp3" },
      { key: "death", url: "/chara/westeastbuttle/sound/death.mp3" },
    ]);
    this.load.audio("bgm", "/chara/westeastbuttle/sound/bgm.mp3");
  }
}
