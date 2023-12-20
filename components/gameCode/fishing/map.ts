import { settingType } from "./setting";

export class map extends Phaser.Scene {
  mapArray: string[];
  setting: settingType;

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

    this.mapArray.forEach((mapName) => {
      this.load.tilemapCSV(mapName, `/chara/fishing/map/${mapName}.csv`);
    });
  }

  create() {
    this.cameras.main.setBackgroundColor("#0384fc");

    const map = this.make.tilemap({
      key: this.setting.currentMapName,
      width: 48,
      height: 48,
    });
    const tileSet = map.addTilesetImage("mapTexture", "mapTexture", 48, 48);
    if (tileSet === null) return;
    const layer = map.createLayer(0, tileSet, 0, 0);
  }
}
