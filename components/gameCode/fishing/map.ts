import { settingType } from "./setting";

export class map extends Phaser.Scene {
  mapArray: string[];
  setting: settingType;
  player?: Phaser.Physics.Arcade.Sprite;
  eventStopper: boolean;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdCursors?: any;

  choicesDialog?: Phaser.GameObjects.DOMElement;

  constructor() {
    super({ key: "map" });
    this.mapArray = ["蔵町", "川町", "浜町", "湖町", "田舎"];
    this.setting = {
      currentMapName: "蔵町",
      positionOfMap: "bus",
    };
    this.eventStopper = false;
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
    const layer = map.createLayer("ground", tileSet, 0, 0);

    layer?.setCollisionByProperty({ collides: true });
    if (layer !== null) this.eventManager(layer);

    /*const debugGraphics = this.add.graphics().setAlpha(0.75);
    layer?.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });*/

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
      this.setting.positionOfMap == "bus"
        ? spawnPointPosition
        : this.setting.positionOfMap;
    //プレイヤーを追加
    this.player = this.physics.add
      .sprite(firstPlayerPosition.x, firstPlayerPosition.y, "player", 0)
      .setSize(30, 30);
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

    //選択用ダイアログ
    const dialogCode = `
      <div id="fm_dialog" style="display:none;">
        <div id="fm_dialog_center">
        </div>
      </div>
      <style>
        #fm_dialog{
          background-color:rgba(0,0,0,0.6);
          width:900px;
          height:600px;
          position:absolute;
          transform:translate(-50%,-50%)
        }
        #fm_dialog_center{
          position:relative;
          display:flex;
          width:900px;
          height:600px;
          justify-content:center;
          align-items:center;
          flex-flow:column;
          gap:40px;
        }
        #fm_dialog_center > button{
          display:block;
          width:200px;
          height:70px;
          font-size:20px;
          background-color:#e3ebff;
          color:black;
          border-radius:3px;
          cursor:pointer;
        }
      </style>
    `;
    this.choicesDialog = this.add.dom(450, 300).createFromHTML(dialogCode);
  }

  update(time: number, delta: number): void {
    //プレイヤーを動かす
    if (this.eventStopper) return;
    const speed = 150;
    this.player?.setVelocity(0);
    if (this.cursors?.left.isDown || this.wasdCursors?.left.isDown) {
      this.player?.setVelocityX(-speed);
      this.player?.setFrame(3);
    } else if (this.cursors?.right.isDown || this.wasdCursors?.right.isDown) {
      this.player?.setVelocityX(speed);
      this.player?.setFrame(1);
    }
    if (this.cursors?.up.isDown || this.wasdCursors?.up.isDown) {
      this.player?.setVelocityY(-speed);
      this.player?.setFrame(2);
    } else if (this.cursors?.down.isDown || this.wasdCursors?.down.isDown) {
      this.player?.setVelocityY(speed);
      this.player?.setFrame(0);
    }
    //斜めに移動したとき速くならないように標準化
    this.player?.body?.velocity.normalize().scale(speed);
  }

  showDialog(choices: string[]): Promise<string> | undefined {
    //イベントをプロミスで処理する
    const dialogElement = this.choicesDialog?.getChildByID("fm_dialog");
    const centerDialogElement =
      this.choicesDialog?.getChildByID("fm_dialog_center");
    this.choicesDialog?.setPosition(
      this.cameras.main.worldView.centerX,
      this.cameras.main.worldView.centerY
    );
    dialogElement?.setAttribute("style", "display:block;");
    if (centerDialogElement === null || centerDialogElement === undefined)
      return;

    return new Promise((resolve) => {
      choices.forEach((val) => {
        const button = document.createElement("button");
        button.innerHTML = val;
        button.addEventListener("click", () => {
          centerDialogElement.innerHTML = "";
          dialogElement?.setAttribute("style", "display:none;");

          resolve(val);
        });
        centerDialogElement?.appendChild(button);
      });
    });
  }

  eventManager(layer: Phaser.Tilemaps.TilemapLayer) {
    //イベント自体はここで定義
    const eventlist = [
      {
        number: [4, 5],
        dialog: [
          {
            desc: "果実をとる",
            eventFunc: () => {},
          },
          {
            desc: "何もしない",
            eventFunc: () => {},
          },
        ],
      },
    ];

    this.eventStopper = false;
    //ものに触れたときのイベントを追加していく
    eventlist.forEach((oneEvent) => {
      layer?.setTileIndexCallback(
        oneEvent.number,
        () => {
          const processForDialog = async () => {
            this.eventStopper = true;
            const descArray = oneEvent.dialog.map((oneDialg) => oneDialg.desc);
            const result = await this.showDialog(descArray);
            if (result === null || result === undefined) return;
            oneEvent.dialog
              .find((oneDialog) => oneDialog.desc === result)
              ?.eventFunc();
            this.eventStopper = false;
          };

          if (this.eventStopper) return;
          processForDialog();

          //falseを設定すると通り抜けないように、trueを返すと通り抜けるようになる。
          return false;
        },
        this
      );
    });
  }
}
