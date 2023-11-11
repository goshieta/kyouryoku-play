import Phaser from "phaser";

type gameConfigType = {
  title: string;
  width: number;
  height: number;
  otherGame: string[];
};
export default function othelloDF(
  gameObjSetting: gameConfigType,
  gameArea: HTMLDivElement
) {
  const config: Phaser.Types.Core.GameConfig = {
    title: "オセロ（リバーシ）",
    type: Phaser.AUTO,
    width: gameObjSetting.width,
    height: gameObjSetting.height,
    parent: gameArea,
    scene: titleScreen,
  };
  const game = new Phaser.Game(config);
  return () => {
    game.destroy(true);
    console.log("destroy");
  };
}

class titleScreen extends Phaser.Scene {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
  preload() {}
  create() {
    const backGround = this.add.graphics();
    backGround.fillStyle(0x24ad52, 1);
    backGround.fillRect(
      0,
      0,
      Number(this.game.config.width),
      Number(this.game.config.height)
    );
    this.add
      .text(250, 100, "オセロ（リバーシ）", {
        font: "40px Zen Kaku Gothic New",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(50, 260, 400, 80)
      .setInteractive(
        new Phaser.Geom.Rectangle(50, 260, 400, 80),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerup", () => {
        console.log("player");
      });
    this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(50, 410, 400, 80)
      .setInteractive(
        new Phaser.Geom.Rectangle(50, 410, 400, 80),
        Phaser.Geom.Rectangle.Contains
      )
      .on("pointerup", () => {
        console.log("bot");
      });

    this.add
      .text(250, 300, "Player VS Player", {
        font: "30px Zen Kaku Gothic New",
        color: "black",
      })
      .setOrigin(0.5)

      .on("pointerup", () => {
        console.log("player");
      });
    this.add
      .text(250, 450, "Player VS Bot", {
        font: "30px Zen Kaku Gothic New",
        color: "black",
      })
      .setOrigin(0.5);
  }
}
