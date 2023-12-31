import { map } from "../map";

export default class player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdCursors?: any;

  mapScene?: map;

  constructor(mapScene: map, map: Phaser.Tilemaps.Tilemap) {
    //スポーンする座標の処理
    const spawnpoint = map.findObject(
      "objects",
      (obj) => obj.name === "spawnPoint"
    );
    const spawnPointPosition =
      spawnpoint === null ||
      spawnpoint.x === undefined ||
      spawnpoint.y === undefined
        ? { x: 100, y: 100 }
        : { x: spawnpoint.x, y: spawnpoint.y };
    const firstPlayerPosition =
      mapScene.setting.positionOfMap == "bus"
        ? spawnPointPosition
        : mapScene.setting.positionOfMap;

    super(mapScene, firstPlayerPosition.x, firstPlayerPosition.y, "player", 0);

    mapScene.add.existing(this);
    mapScene.physics.add.existing(this);

    this.setSize(30, 30);

    this.mapScene = mapScene;

    //キーボード
    this.cursors = mapScene.input.keyboard?.createCursorKeys();
    this.wasdCursors = mapScene.input.keyboard?.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
    });

    mapScene.add.existing(this);
  }
  protected preUpdate(time: number, delta: number): void {
    //プレイヤーを動かす
    this.setVelocity(0);
    if (this.mapScene?.eventStopper) return;
    const speed = 150;
    if (this.cursors?.left.isDown || this.wasdCursors?.left.isDown) {
      this.setVelocityX(-speed);
      this.setFrame(3);
    } else if (this.cursors?.right.isDown || this.wasdCursors?.right.isDown) {
      this.setVelocityX(speed);
      this.setFrame(1);
    }
    if (this.cursors?.up.isDown || this.wasdCursors?.up.isDown) {
      this.setVelocityY(-speed);
      this.setFrame(2);
    } else if (this.cursors?.down.isDown || this.wasdCursors?.down.isDown) {
      this.setVelocityY(speed);
      this.setFrame(0);
    }
    //斜めに移動したとき速くならないように標準化
    this.body?.velocity.normalize().scale(speed);
  }
}
