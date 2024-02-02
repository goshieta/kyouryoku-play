import gameEventUi from "./components/gameEventUi";
import sprite from "./components/sprite";
import ui from "./components/ui";

export class game extends Phaser.Scene {
  gameStopper: boolean = true;
  private background?: Phaser.GameObjects.TileSprite;
  private bricks?: Phaser.Physics.Arcade.Group;
  private bricksFloor?: Phaser.Physics.Arcade.StaticGroup;
  private torches?: Phaser.GameObjects.Group;
  private darknessOverlay?: Phaser.GameObjects.Rectangle;
  private player?: sprite;
  private gameEventUi?: gameEventUi;

  getPlayer = () => this.player;

  audio?: {
    jump: Phaser.Sound.BaseSound;
    damage: Phaser.Sound.BaseSound;
  };

  score: number = 0;

  constructor() {
    super("game");
  }
  create() {
    // 背景の壁を作成
    this.background = this.add.tileSprite(
      0,
      0,
      this.sys.canvas.width,
      this.sys.canvas.height,
      "stoneBricks"
    );
    this.background.setOrigin(0, 0);

    // 松明のグループを初期化
    this.torches = this.add.group({
      key: "torch",
      repeat: 8, // 10回繰り返す（仮の数）
      setXY: { x: 100, y: 200, stepX: 100 }, // 松明の間隔
    });

    // 暗くするためのオーバーレイを作成
    this.darknessOverlay = this.add
      .rectangle(0, 0, 800, 600, 0x000000, 0.5)
      .setOrigin(0, 0);

    //石レンガの床のグループ
    this.bricksFloor = this.physics.add.staticGroup({
      randomKey: true,
      key: ["mossyStoneBricks", "stoneBricks"],
      repeat: 13,
      setXY: { x: 32, y: 480, stepX: 64 },
    });

    // 石レンガと苔石レンガの壁を作成するためのグループを初期化
    this.bricks = this.physics.add.group();

    //下のUI
    new ui(this);

    //プレイヤー
    this.player = new sprite(this);

    this.physics.add.collider(this.player, this.bricksFloor, () => {
      this.player?.setIsFloating(false);
    });
    this.physics.add.overlap(this.player, this.bricks, () => {
      //ゲームオーバー
      if (!this.gameStopper) this.sound.play("damage");
      this.gameStopper = true;
      if (this.gameEventUi) this.gameEventUi.mode = 2;
    });

    //ゲームのスタートなどを制御するUI
    this.gameEventUi = new gameEventUi(this);

    //バックミュージック
    const backMusic = this.sound.add("back", { loop: true, volume: 0.5 });
    backMusic.play();
    this.audio = {
      jump: this.sound.add("jump"),
      damage: this.sound.add("damage"),
    };
  }

  stoneWallPadding: number = 1000;
  BeforeBricksTall: number = 0;
  NextBeicksTall: number = Math.floor(Math.random() * 5 + 1);

  scrollSpeed: number = 5;

  update(time: number, delta: number): void {
    if (this.gameStopper) return;
    // スクロール速度を設定
    this.scrollSpeed += delta * 0.0001;

    this.score += this.scrollSpeed / 30;

    if (!this.background || !this.bricks || !this.torches) return;
    // 背景の壁をスクロール
    this.background.tilePositionX += this.scrollSpeed;

    // 石レンガと苔石レンガの壁をスクロール
    let removeBricksList: any[] = [];
    this.bricks.children.iterate((brick: any) => {
      brick.x -= this.scrollSpeed;

      // 石レンガが画面外に出たら削除
      if (brick.x < -80) {
        removeBricksList.push(brick);
      }
      return true;
    });
    removeBricksList.forEach((oneBrick: any) => {
      oneBrick.destroy();
    });

    //床をスクロール
    this.bricksFloor?.children.iterate((brick: any) => {
      brick.x -= this.scrollSpeed;

      if (brick.x < -32) brick.x = 832;
      return true;
    });

    // 松明をスクロール
    this.torches.children.iterate((torch: any) => {
      torch.x -= this.scrollSpeed;

      // 松明が画面外に出たら再配置
      if (torch.x < 0) {
        torch.x = 880;
      }
      return true;
    });

    //プレイヤーがジャンプしたときの地面につくまでの間隔は272x+1094で求まる
    this.stoneWallPadding += delta;
    if (
      this.stoneWallPadding > (272 * this.BeforeBricksTall + 1094) / 2 &&
      Math.random() < 0.8
    ) {
      const stoneWallPaddingDiffer =
        this.stoneWallPadding - (272 * this.BeforeBricksTall + 1094) / 2;
      if (
        stoneWallPaddingDiffer >
        (272 * this.NextBeicksTall + 1094) / 2 + 150
      ) {
        this.generateBricks(this.NextBeicksTall);
        this.NextBeicksTall = Math.floor(Math.random() * 5 + 1);
        this.stoneWallPadding = 0;
      }
    }
  }
  private generateBricks(tall: number) {
    if (!this.bricks) return;
    const brickCount = 5;
    const brickInterval = 64; // 障害物の間隔
    const paddingNumber = 5 - tall;
    this.BeforeBricksTall = 5 - paddingNumber;

    for (let i = 0; i < brickCount; i++) {
      const x = 880;
      const y =
        brickInterval / 2 + i * brickInterval + (paddingNumber <= i ? 128 : 0);

      // 一定の確率で苔石レンガを挿入
      if (Math.random() < 0.4) {
        const brick = this.bricks.create(x, y, "mossyStoneBricks");
        brick.body.setAllowGravity(false);
      } else {
        const brick = this.bricks.create(x, y, "stoneBricks");
        brick.body.setAllowGravity(false);
      }
    }
  }
  clear() {
    this.bricks?.clear(true);
    this.score = 0;
    this.stoneWallPadding = 1000;
    this.BeforeBricksTall = 0;
    this.NextBeicksTall = Math.floor(Math.random() * 5 + 1);
    this.gameStopper = false;
    this.scrollSpeed = 5;
  }
}
