import bot from "./bot/bot";
import header from "./components/header";
import item from "./components/item";
import sprite, { spriteMain } from "./components/sprite";

export class game extends Phaser.Scene {
  me: spriteMain[] = [];
  you: spriteMain[] = [];

  pauseInput: boolean = false;
  playerMode: 1 | 2 = 1;

  //ゲームの状態
  isMeTurn: boolean = true;
  isGaming: boolean = false;

  constructor() {
    super("game");
  }
  create() {
    this.cameras.main.setBackgroundColor("#31d658");

    this.createSprite();
    new header(this);
    //bgm再生
    this.sound.add("bgm", { loop: true }).play();

    //ゲームスタート
    this.isGaming = true;
  }

  itemDeltaCache: number = 0;
  botInterval: number = 0;

  update(time: number, delta: number): void {
    this.itemDeltaCache += delta;
    if (this.itemDeltaCache > 5000) {
      this.createItem();
      this.itemDeltaCache = 0;
    }

    //BOTを動かす
    if (this.playerMode == 1 && !this.isMeTurn) {
      this.botInterval += delta;
      if (this.botInterval < 1000) return;
      this.botInterval = 0;
      const next: {
        targetSprite: sprite;
        targetDir: [number, number];
      } | null = bot({
        me: this.me,
        you: this.you,
      });
      if (next === null) return;
      next.targetSprite.wayOfOperationForBot(
        next.targetDir[0],
        next.targetDir[1]
      );
    }
  }

  init(config: { player: 1 | 2 }) {
    this.playerMode = config.player;

    this.me = [];
    this.you = [];
  }

  createSprite() {
    //スプライトを作成
    let spritePositionData: {
      me: [number, number][];
      you: [number, number][];
    } = {
      me: [
        [75, 100],
        [150, 100],
        [225, 100],
        [75, 200],
        [150, 200],
        [225, 200],
        [300, 300],
        [75, 400],
        [150, 400],
        [225, 400],
        [75, 500],
        [150, 500],
        [225, 500],
      ],
      you: [
        [725, 100],
        [650, 100],
        [575, 100],
        [725, 200],
        [650, 200],
        [575, 200],
        [500, 300],
        [725, 400],
        [650, 400],
        [575, 400],
        [725, 500],
        [650, 500],
        [575, 500],
      ],
    };
    spritePositionData.me.forEach((val) => {
      const m = Math.floor(Math.random() * 40 + 50);
      const meContainer = new sprite(this, val[0], val[1], m, true);
      this.me.push(meContainer.spriteMain);
    });
    spritePositionData.you.forEach((val) => {
      const m = Math.floor(Math.random() * 40 + 50);
      const youContainer = new sprite(this, val[0], val[1], m, false);
      this.you.push(youContainer.spriteMain);
    });
    //最前面に表示するため、最後に王を追加
    const meKing = new sprite(this, 150, 300, 100, true, true);
    this.me.push(meKing.spriteMain);
    const youKing = new sprite(this, 650, 300, 100, false, true);
    this.you.push(youKing.spriteMain);
    //当たり判定
    this.physics.add.overlap(this.me, this.you, (obj1, obj2) => {
      (<spriteMain>obj1).attacked();
      (<spriteMain>obj2).attacked();
    });
  }

  createItem() {
    const itemArray = ["protect", "recovery", "speedup", "stalker"];
    const itemContainer = new item(
      this,
      Math.floor(Math.random() * 300 + 250),
      Math.floor(Math.random() * 500 + 50),
      itemArray[Math.floor(Math.random() * 4)]
    );
    this.physics.add.overlap(
      this.me.concat(this.you),
      itemContainer.mainSprite,
      (Asprite) => {
        itemContainer.touched();
        this.sound.add("get").play();
        (<spriteMain>Asprite).getItem(itemContainer.itemName);
      }
    );
  }

  gameEnd(result: boolean) {
    this.scene.start("score", { resultForMe: result });
  }
}
