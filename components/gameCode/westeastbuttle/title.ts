export class title extends Phaser.Scene {
  constructor() {
    super("title");
  }

  create() {
    const dom = this.add.dom(400, 300).createFromCache("mainHTML");
    const buttons = dom.getChildByID("wt_main_button")?.children;
    if (!buttons) return;
    Array.from(buttons).forEach((button, index) => {
      button.addEventListener("click", () =>
        this.scene.start("game", { player: index + 1 })
      );
    });
  }
}
