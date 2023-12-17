export class main extends Phaser.Scene {
  player?: Phaser.Physics.Arcade.Sprite;
  menuDom?: Phaser.GameObjects.DOMElement;
  matoriteGroup?: Phaser.GameObjects.Group;
  starGroup?: Phaser.GameObjects.Group;
  boostGroup?: Phaser.GameObjects.Group;
  gameState: "pause" | "active";
  matoriteTime: number;
  speed: number;
  starNumber: number;

  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "main" });

    this.gameState = "pause";
    this.matoriteTime = 0;
    this.speed = 200;
    this.starNumber = 0;
  }
  preload() {
    this.load.image("plane", "/chara/flyfly/飛行機.svg");
    this.load.image("metorite", "/chara/flyfly/障害物.svg");
    this.load.image("star", "/chara/flyfly/星.svg");
    this.load.image("boost", "/chara/flyfly/ブースト.svg");
  }
  create() {
    this.physics.pause();
    //背景
    this.add.rectangle(400, 300, 800, 600, 0x3c006e);

    //障害物のグループ
    this.matoriteGroup = this.physics.add.staticGroup();
    //星のグループ
    this.starGroup = this.physics.add.staticGroup();
    //ブーストのグループ
    this.boostGroup = this.physics.add.staticGroup();

    //メインオブジェクト
    this.player = this.physics.add
      .sprite(100, 300, "plane")
      .setDisplaySize(100, 100)
      .setOrigin(0.5, 0.5);
    this.physics.add.existing(this.player).setSize(150, 50);

    //メニューのDOM
    const menuCode = `
      <div id="f_menu">
        <button id="f_menu_play_button">Play</button>
      </div>
      <style>
        #f_menu{
          background-color:rgba(0, 0, 0, 0.5);
          width:800px;
          height:600px;
          border-radius;5px;
          display:flex;
          justify-content:center;
          align-items:center;
        }
        #f_menu button{
          width:100px;
          height:50px;
          background-color:#8b00ff;
          font-size:20px;
          border-radius:3px;
          cursor:pointer;
          color:white;
        }
        #f_menu button:hover{
          background-color:#7900de;
        }
      </style>
    `;
    this.menuDom = this.add.dom(400, 300).createFromHTML(menuCode);
    this.menuDom
      .getChildByID("f_menu_play_button")
      ?.addEventListener("click", this.gameActivate.bind(this));

    this.input.keyboard?.on("keyup", this.fly.bind(this));
    this.input.on("pointerdown", this.fly.bind(this));
  }

  gameActivate() {
    //ゲームを一時停止状態から、再開する
    this.gameState = "active";
    this.physics.resume();
    (<any>this.menuDom?.getChildByID("f_menu")).style.display = "none";
  }

  update(time: number, delta: number): void {
    this.matoriteTime += delta;
    //隕石を追加
    if (
      this.matoriteTime > 200000 / this.speed &&
      Math.floor(Math.random() * 5) === 0 &&
      this.gameState === "active" &&
      this.matoriteGroup !== undefined
    ) {
      const newMatorite = this.physics.add
        .sprite(900, Math.floor(Math.random() * 600), "metorite")
        .setDisplaySize(80, 80)
        .setGravityY(-500)
        .setCircle(75);
      this.matoriteGroup.add(newMatorite);
      this.physics.add.existing(newMatorite);
      if (this.player === undefined) return;
      //当たり判定
      this.physics.add.overlap(this.player, newMatorite, () => {
        newMatorite.destroy();
      });
      this.matoriteTime = 0;
    }
    //星を追加
    if (
      Math.floor(Math.random() * (30000 / this.speed)) === 0 &&
      this.gameState === "active" &&
      this.starGroup !== undefined
    ) {
      const newStar = this.physics.add
        .sprite(900, Math.floor(Math.random() * 600), "star")
        .setDisplaySize(40, 40)
        .setGravityY(-500);
      this.starGroup.add(newStar);
      if (this.player === undefined) return;
      //当たり判定
      this.physics.add.overlap(this.player, newStar, () => {
        newStar.destroy();
        this.starNumber++;
      });
    }
    //ブーストを追加
    if (
      Math.floor(Math.random() * (30000 / this.speed)) === 0 &&
      this.gameState === "active" &&
      this.boostGroup !== undefined
    ) {
      const newBoost = this.physics.add
        .sprite(900, Math.floor(Math.random() * 600), "boost")
        .setDisplaySize(50, 50)
        .setGravityY(-500);
      this.boostGroup.add(newBoost);
      if (this.player === undefined) return;
      //当たり判定
      this.physics.add.overlap(this.player, newBoost, () => {
        newBoost.destroy();
        this.speed += 50;
      });
    }

    //隕石などを動かす
    [
      ...(<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>(
        this.matoriteGroup?.children.getArray()
      )),
      ...(<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>(
        this.starGroup?.children.getArray()
      )),
      ...(<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[]>(
        this.boostGroup?.children.getArray()
      )),
    ].forEach((gameObj) => {
      gameObj.setVelocityX(-this.speed);
      if (gameObj.x < -100) gameObj.destroy();
    });
  }

  fly(event: KeyboardEvent | MouseEvent) {
    if (event instanceof KeyboardEvent && event.key !== " ") return;
    if (this.gameState != "active") return;
    //飛ぶ処理
    this.player?.setVelocity(0, -400);
  }
}
