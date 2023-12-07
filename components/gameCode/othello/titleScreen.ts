import Phaser from "phaser";

export class titleScreen extends Phaser.Scene {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super({ ...config, key: "titleScreen" });
  }
  preload() {}
  create() {
    const backGround = this.add.graphics();
    backGround.fillStyle(0x1aff97, 1);
    backGround.fillRect(
      0,
      0,
      Number(this.game.config.width),
      Number(this.game.config.height)
    );

    const buttonDom = this.add.dom(250, 300).createFromHTML(`
    <div>
      <button id="singlePlayButton" style="cursor:pointer;margin:60px;display:block;border-radius:5px;width:200px;height:60px;font-size:20px;font-weight:bold;">始める</button>
    </div>`);
    buttonDom
      .getChildByID("singlePlayButton")
      ?.addEventListener("click", () => {
        this.scene.start("game", { mode: "bot" });
      });
    /*buttonDom
      .getChildByID("doublePlayButton")
      ?.addEventListener("click", () => {
        this.scene.start("game", { mode: "player" });
      });*/
  }
}
