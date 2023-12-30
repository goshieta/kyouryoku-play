import { settingType } from "./setting";
import { header } from "./header";

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
  eventStopper: boolean = false;

  fishShadows: { obj: Phaser.GameObjects.Sprite; time: number }[] = [];

  constructor() {
    super({ key: "fishing" });
  }

  preload() {
    this.load.spritesheet("fishShadow", "/chara/fishing/fishShadow.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  init(config: settingType) {
    this.setting = config;
  }

  create() {
    this.cameras.main.setBackgroundColor("#0384fc");

    new header(
      this,
      this.setting,
      () => this.eventStopper,
      (newVal) => (this.eventStopper = newVal),
      {
        specialItem: [
          {
            itemName: "釣り竿",
            canSetItem: ["treeBranch"],
            setEvent(newSet) {},
          },
          {
            itemName: "エサ",
            canSetItem: ["aoiisome", "redIsome", "chirori", "stoneLugworm"],
            setEvent(newSet) {},
          },
        ],
      }
    );

    //魚影作成
    for (let i = 0; i < 1; i++) {
      this.fishShadows.push({
        obj: this.add
          .sprite(
            Math.random() * 900,
            Math.random() * 600,
            "fishShadow",
            Math.floor(Math.random() * 3)
          )
          .setAlpha(0),
        time: 0,
      });
    }
  }

  update(time: number, delta: number) {
    this.fishShadows = this.fishShadows.filter((oneFish) => {
      //alphaと削除
      if (oneFish.time <= 1) oneFish.obj.alpha = oneFish.time;
      if (oneFish.time >= 19) oneFish.obj.alpha = -oneFish.time + 20;
      if (oneFish.time > 20) {
        oneFish.obj.destroy();
        return false;
      }
      //アングルから計算した方向に進む
      oneFish.obj.setX(
        oneFish.obj.x + Math.cos(oneFish.obj.angle * (Math.PI / 180))
      );
      oneFish.obj.setY(
        oneFish.obj.y + Math.sin(oneFish.obj.angle * (Math.PI / 180))
      );
      //アングルを変更する。
      oneFish.obj.angle = Math.sin(oneFish.time) * 180 + 180;
      oneFish.time += delta / 1000;

      return true;
    });
    //魚作成
    if (Math.floor(Math.random() * 20) === 0) {
      this.fishShadows.push({
        obj: this.add
          .sprite(
            Math.random() * 900,
            Math.random() * 600,
            "fishShadow",
            Math.floor(Math.random() * 3)
          )
          .setAlpha(0),
        time: 0,
      });
    }
  }
}
