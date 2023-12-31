import { settingType } from "./setting";
import putItemList from "./itemList";
import { header } from "./header";
import player from "./map/player";

export class map extends Phaser.Scene {
  mapArray: string[];
  setting: settingType;
  player?: Phaser.Physics.Arcade.Sprite;
  cameraDolly?: Phaser.Geom.Point;
  eventStopper: boolean;
  header?: HTMLDivElement;
  headerMainObject?: {
    state: {
      health: HTMLDivElement;
      hunger: HTMLDivElement;
    };
    items: {
      gameContainer: HTMLDivElement;
      itemNumberString: HTMLParagraphElement;
      itemName: string;
    }[];
    itemContainer: HTMLDivElement;
  };
  uiCamera?: Phaser.Cameras.Scene2D.Camera;

  mapDom?: header;

  constructor() {
    super({ key: "map" });
    this.mapArray = ["蔵町", "川町", "浜町", "湖町", "田舎"];
    this.setting = {
      currentMapName: "蔵町",
      positionOfMap: "bus",
      playerState: {
        items: [],
        health: 0,
        hunger: 0,
      },
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
    this.load.spritesheet("items", "/chara/fishing/header/item/items.png", {
      frameWidth: 24,
      frameHeight: 24,
    });

    this.mapArray.forEach((mapName) => {
      this.load.tilemapTiledJSON(mapName, `/chara/fishing/map/${mapName}.json`);
    });

    this.load.svg("health", "/chara/fishing/header/state/health.svg", {
      width: 20,
      height: 20,
    });
    this.load.svg("hunger", "/chara/fishing/header/state/hunger.svg", {
      width: 20,
      height: 20,
    });
    this.load.html("mapDom", "/chara/fishing/dom/mapDom.html");
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

    //プレイヤー
    this.player = new player(this, map);
    this.physics.add.collider(this.player, <any>layer);

    //選択用ダイアログ、ヘッダーなどの各種DOM
    this.mapDom = new header(
      this,
      this.setting,
      () => this.eventStopper,
      (newVal) => (this.eventStopper = newVal)
    );

    this.make.tilemap();

    //カメラ
    this.cameraDolly = new Phaser.Geom.Point(this.player.x, this.player.y);
    this.cameras.main.startFollow(this.cameraDolly);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.uiCamera = this.cameras.add(0, 0, 900, 600);

    this.uiCamera.ignore([this.player, <any>layer]);
    this.cameras.main.ignore([this.mapDom]);
  }

  update(time: number, delta: number): void {
    if (this.player === undefined) return;

    this.cameraDolly?.setTo(
      Math.floor(this.player.x),
      Math.floor(this.player.y)
    );

    //ステートの更新
    //this.setting.playerState.hunger -= 0.01;
  }

  setEventStopper = (newEventStopper: boolean) =>
    (this.eventStopper = newEventStopper);

  eventManager(layer: Phaser.Tilemaps.TilemapLayer) {
    //イベント自体はここで定義
    const eventlist: {
      number: number[];
      dialog: {
        desc: string;
        eventFunc?: () => void;
      }[];
    }[] = [
      {
        number: [4, 5],
        dialog: [
          {
            desc: "果実をとる",
            eventFunc: () => {
              this.mapDom?.itemHundle("rowFluit", 1);
              this.mapDom?.showRichDialog(
                ["わかった"],
                this.eventStopper,
                this.setEventStopper,
                "低木の実を獲得した。",
                "/chara/fishing/header/item/items/rowFluit.png"
              );
            },
          },
          {
            desc: "何もしない",
          },
        ],
      },
      {
        number: [10, 11, 19, 20],
        dialog: [
          {
            desc: "果実をとる",
            eventFunc: () => {
              this.mapDom?.itemHundle("treeFluit", 1);
              this.mapDom?.showRichDialog(
                ["わかった"],
                this.eventStopper,
                this.setEventStopper,
                "普通の木の実を獲得した。",
                "/chara/fishing/header/item/items/treeFluit.png"
              );
            },
          },
          {
            desc: "何もしない",
          },
        ],
      },
      {
        number: [12, 13, 21, 22],
        dialog: [
          {
            desc: "木をゆする",
            eventFunc: () => {
              this.mapDom?.itemHundle(
                "treeBranch",
                Math.floor(Math.random() * 3 + 1)
              );
              this.mapDom?.showRichDialog(
                ["わかった"],
                this.eventStopper,
                this.setEventStopper,
                "木の枝が落ちてきた",
                "/chara/fishing/header/item/items/treeBranch.png"
              );
            },
          },
          {
            desc: "何もしない",
          },
        ],
      },
      {
        number: [53],
        dialog: [
          {
            desc: "バスに乗る",
            eventFunc: async () => {
              //バスの画面に遷移する
              const townList = ["蔵町", "川町", "浜町", "湖町", "田舎"];
              const town = await this.mapDom?.showRichDialog(
                townList.filter(
                  (oneTown) => oneTown !== this.setting.currentMapName
                ),
                this.eventStopper,
                this.setEventStopper,
                `バス停名 : ${this.setting.currentMapName} <br><br>どの町に行きますか？（運賃一律10pt）`,
                "/chara/fishing/otherImage/バス停.png"
              );
              this.scene.start("map", {
                ...this.setting,
                currentMapName: town,
                positionOfMap: "bus",
              });
            },
          },
          {
            desc: "金がないのでバスには乗らない",
            eventFunc: () => {
              this.mapDom?.showRichDialog(
                ["理解した"],
                this.eventStopper,
                this.setEventStopper,
                "お金の稼ぎ方がわからない場合は、画面下のゲームの遊び方を読みましょう。"
              );
            },
          },
          {
            desc: "気分じゃないのでバスにならない",
            eventFunc: () => {
              this.mapDom?.showRichDialog(
                ["はい"],
                this.eventStopper,
                this.setEventStopper,
                "またのご利用をお待ちしております。"
              );
            },
          },
          {
            desc: "その他の理由でバスに乗らない",
          },
        ],
      },
      {
        number: [2],
        dialog: [
          {
            desc: "釣りをする",
            eventFunc: () => {
              this.scene.start("fishing", this.setting);
            },
          },
          {
            desc: "釣りをしない",
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
            const result = await this.mapDom?.showDialog(descArray);
            if (result === null || result === undefined) return;
            this.eventStopper = false;
            const desc = oneEvent.dialog.find(
              (oneDialog) => oneDialog.desc === result
            );
            if (desc?.eventFunc) {
              desc?.eventFunc();
            }
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
