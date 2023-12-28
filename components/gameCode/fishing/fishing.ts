import { settingType } from "./setting";

export class fishing extends Phaser.Scene {
  setting: settingType = {
    currentMapName: "蔵町",
    positionOfMap: "bus",
    playerState: {
      items: [],
      health: 0,
      hunger: 0,
    },
  };

  constructor() {
    super({ key: "fishing" });
  }
  init(config: settingType) {
    this.setting = config;
  }
}
