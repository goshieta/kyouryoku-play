import { settingType } from "./setting";
import putItemList from "./itemList";
import { count } from "console";

export class map extends Phaser.Scene {
  mapArray: string[];
  setting: settingType;
  player?: Phaser.Physics.Arcade.Sprite;
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

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdCursors?: any;

  mapDom?: Phaser.GameObjects.DOMElement;

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

    //キーボード
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasdCursors = this.input.keyboard?.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
    });

    //選択用ダイアログ、ヘッダーなどの各種DOM
    this.mapDom = this.add.dom(450, 300).createFromCache("mapDom");
    this.header = <HTMLDivElement>this.mapDom.getChildByID("fm_header");
    //アイテム
    const itemGameObj = this.setting.playerState.items.map((oneItem, index) => {
      return this.makeHeaderItem(
        index,
        oneItem,
        <HTMLDivElement>this.mapDom?.getChildByID("fm_items")
      );
    });
    this.headerMainObject = {
      state: {
        health: <HTMLDivElement>(
          this.mapDom.getChildByID("fm_state_progress_health")
        ),
        hunger: <HTMLDivElement>(
          this.mapDom.getChildByID("fm_state_progress_hunger")
        ),
      },
      items: itemGameObj,
      itemContainer: <HTMLDivElement>this.mapDom.getChildByID("fm_items"),
    };

    //カメラ
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.uiCamera = this.cameras.add(0, 0, 900, 600);

    this.uiCamera.ignore([this.player, <any>layer]);
    this.cameras.main.ignore([this.mapDom]);
  }

  update(time: number, delta: number): void {
    //プレイヤーを動かす
    this.player?.setVelocity(0);
    if (this.eventStopper) return;
    const speed = 150;
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

    //ヘッダーを更新
    if (this.headerMainObject === undefined) return;
    this.headerMainObject.state.health.style.width = `${
      this.setting.playerState.health * 1.5
    }px`;
    this.headerMainObject.state.hunger.style.width = `${
      this.setting.playerState.hunger * 1.5
    }px`;
    //アイテムを更新
    let restItemList = this.setting.playerState.items;
    this.headerMainObject.items = this.headerMainObject.items.filter(
      (oneItem, index) => {
        const itemInfo = restItemList.find(
          (oneItemInfo) => oneItemInfo.name === oneItem.itemName
        );
        if (itemInfo === undefined) {
          this.headerMainObject?.items.splice(index, 1);
          return false;
        }
        oneItem.itemNumberString.innerHTML = itemInfo.count.toString();
        restItemList = restItemList.filter(
          (searchSubject) => searchSubject !== itemInfo
        );
        return true;
      }
    );
    //新規アイテムの作成
    restItemList.forEach((restItem, index) => {
      if (this.headerMainObject === undefined) return;
      this.headerMainObject.items.push(
        this.makeHeaderItem(
          this.headerMainObject?.items.length + index,
          restItem,
          this.headerMainObject.itemContainer
        )
      );
    });

    //ステートの更新
    //this.setting.playerState.hunger -= 0.01;
  }

  makeHeaderItem(
    index: number,
    oneItemInfo: { name: string; count: number },
    item: HTMLDivElement
  ) {
    //ヘッダーのアイテムのUIを新規作成する。
    const parent = document.createElement("div");
    const image = document.createElement("img");
    image.src = `/chara/fishing/header/item/items/${oneItemInfo.name}.png`;
    const itemNumberString = document.createElement("p");
    itemNumberString.innerHTML = String(index);
    parent.appendChild(image);
    parent.appendChild(itemNumberString);
    item.appendChild(parent);
    return {
      gameContainer: parent,
      itemNumberString: itemNumberString,
      itemName: oneItemInfo.name,
    };
  }

  showDialog(choices: string[]): Promise<string> | undefined {
    //イベントをプロミスで処理する
    const dialogElement = this.mapDom?.getChildByID("fm_dialog");
    const centerDialogElement = this.mapDom?.getChildByID("fm_dialog_center");
    this.mapDom?.setPosition(450, 300);
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
  showRichDialog(choices: string[], desc?: string, imagePath?: string) {
    if (this.eventStopper) return;
    this.eventStopper = false;
    //リッチなダイアログ
    if (this.mapDom === undefined) return;
    const dialog = <HTMLDivElement>this.mapDom.getChildByID("fm_rich_dialog");
    dialog.style.display = "flex";
    const descArea = <HTMLDivElement>dialog.querySelector("#fm_descArea");
    if (desc !== undefined || imagePath !== undefined) {
      descArea.style.display = "flex";
      const img = <HTMLImageElement>descArea.querySelector("#fm_desc_img");
      const p = <HTMLPreElement>descArea.querySelector("#fm_desc_p");
      img.style.display = "none";
      p.style.display = "none";
      if (imagePath !== undefined) {
        img.style.display = "block";
        img.src = imagePath;
      }
      if (desc !== undefined) {
        p.style.display = "block";
        p.innerHTML = desc;
      }
    } else {
      descArea.style.display = "none";
    }
    //ボタンを表示
    const buttonArea = <HTMLDivElement>(
      dialog.querySelector("#fm_dialog_button_area")
    );
    this.eventStopper = false;
    return new Promise((resolve) => {
      choices.forEach((val) => {
        const button = document.createElement("button");
        button.innerHTML = val;
        button.addEventListener("click", () => {
          buttonArea.innerHTML = "";
          dialog?.setAttribute("style", "display:none;");

          resolve(val);
        });
        buttonArea.appendChild(button);
      });
    });
  }

  itemHundle(name: string, size: number) {
    //アイテムに関する操作を提供する
    //nameにアイテムの名前、sizeに増減の数を記述する
    const item = this.setting.playerState.items.find(
      (oneItem) => oneItem.name === name
    );
    if (item === undefined) {
      if (size >= 0)
        this.setting.playerState.items.push({ name: name, count: size });
      return;
    }
    item.count += size;
    if (item.count <= 0) {
      this.setting.playerState.items = this.setting.playerState.items.filter(
        (searchSubject) => searchSubject !== item
      );
    }
  }

  eventManager(layer: Phaser.Tilemaps.TilemapLayer) {
    //イベント自体はここで定義
    const eventlist = [
      {
        number: [4, 5],
        dialog: [
          {
            desc: "果実をとる",
            eventFunc: () => {
              this.itemHundle("rowFluit", 1);
              this.showRichDialog(
                ["わかった"],
                "低木の実を獲得した。",
                "/chara/fishing/header/item/items/rowFluit.png"
              );
            },
          },
          {
            desc: "何もしない",
            eventFunc: () => {},
          },
        ],
      },
      {
        number: [10, 11, 19, 20],
        dialog: [
          {
            desc: "果実をとる",
            eventFunc: () => {
              this.itemHundle("treeFluit", 1);
              this.showRichDialog(
                ["わかった"],
                "普通の木の実を獲得した。",
                "/chara/fishing/header/item/items/treeFluit.png"
              );
            },
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
            this.eventStopper = false;
            oneEvent.dialog
              .find((oneDialog) => oneDialog.desc === result)
              ?.eventFunc();
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
