export class map extends Phaser.Scene {
  constructor() {
    super({ key: "map" });
  }

  preload() {
    this.load.image("mapTexture", "/chara/fishing/mapTexture.png");
    this.load.tilemapCSV("map", "/chara/fishing/map.csv");
  }

  create() {
    this.cameras.main.setBackgroundColor("#0384fc");

    const map = this.make.tilemap({ key: "map", width: 48, height: 48 });
    const tileSet = map.addTilesetImage("mapTexture", "mapTexture", 48, 48);
    if (tileSet === null) return;
    const layer = map.createLayer(0, tileSet, 0, 0);
  }
}
