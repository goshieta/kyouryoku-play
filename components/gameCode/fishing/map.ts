import { settingType } from "./setting";

export class map extends Phaser.Scene {
  mapArray: string[];
  setting: settingType;
  player?: Phaser.Physics.Arcade.Sprite;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdCursors?: any;

  constructor() {
    super({ key: "map" });
    this.mapArray = ["蔵町", "川町", "浜町", "湖町", "田舎"];
    this.setting = {
      currentMapName: "蔵町",
      positionOfMap: "bus",
    };
  }

  init(setting: settingType) {
    this.setting = setting;
  }

  preload() {
    this.load.image("mapTexture", "/chara/fishing/map.png");
    this.load.spritesheet("player", "/chara/fishing/player.png", {
      frameWidth: 33,
      frameHeight: 48,
    });

    this.mapArray.forEach((mapName) => {
      this.load.tilemapTiledJSON(mapName, `/chara/fishing/map/${mapName}.json`);
    });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0384fc");

    const map = this.make.tilemap({
      key: this.setting.currentMapName,
    });
    const tileSet = map.addTilesetImage("tileset", "mapTexture", 48, 48);
    if (tileSet === null) return;
    const layer = map.createLayer(0, tileSet, 0, 0);

    layer?.setCollisionByProperty({ collides: true });

    /*const debugGraphics = this.add.graphics().setAlpha(0.75);
    layer?.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });*/

    //プレイヤー
    this.player = this.physics.add.sprite(20, 20, "player", 0).setSize(30, 30);
    this.physics.add.collider(this.player, <any>layer);

    //カメラ
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //キーボード
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasdCursors = this.input.keyboard?.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
    });
  }

  update(time: number, delta: number): void {
    //プレイヤーを動かす
    const speed = 150;
    this.player?.setVelocity(0);
    if (this.cursors?.left.isDown || this.wasdCursors?.left.isDown) {
      this.player?.setVelocityX(-speed);
    } else if (this.cursors?.right.isDown || this.wasdCursors?.right.isDown) {
      this.player?.setVelocityX(speed);
    }
    if (this.cursors?.up.isDown || this.wasdCursors?.up.isDown) {
      this.player?.setVelocityY(-speed);
    } else if (this.cursors?.down.isDown || this.wasdCursors?.down.isDown) {
      this.player?.setVelocityY(speed);
    }
    //斜めに移動したとき速くならないように標準化
    this.player?.body?.velocity.normalize().scale(speed);
  }
}
