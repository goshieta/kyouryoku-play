import { game } from "../game";

export default class gameEventUi extends Phaser.GameObjects.Container {
  mode: 0 | 1 | 2 = 0;

  private shadow: Phaser.GameObjects.Rectangle;
  private startText: Phaser.GameObjects.Text;

  private scoreText: Phaser.GameObjects.Text;
  private retryButton: Phaser.GameObjects.DOMElement;

  game: game;

  constructor(game: game) {
    super(game, 400, 300);
    this.game = game;

    this.shadow = game.add.rectangle(0, 0, 800, 600, 0x000000, 0.5);
    this.shadow.setInteractive();
    this.shadow.on("pointerup", () => {
      this.mode = 1;
      game.gameStopper = false;
    });
    this.add(this.shadow);
    this.startText = game.add
      .text(0, 0, "クリックでスタート", { fontSize: 50 })
      .setFill("white")
      .setOrigin(0.5, 0.5);
    this.add(this.startText);
    game.tweens.add({
      targets: this.startText,
      alpha: 0.1,
      duration: 1000,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });

    this.scoreText = game.add
      .text(0, -50, `スコア : ${Math.floor(game.score)}`, { fontSize: 30 })
      .setFill("white")
      .setOrigin(0.5, 0.5);
    this.add(this.scoreText);
    this.retryButton = game.add.dom(
      0,
      50,
      "button",
      {
        color: "white",
        backgroundColor: "black",
        outline: "none",
        border: "none",
        borderRadius: "5px",
        width: "150px",
        height: "50px",
      },
      "リトライ"
    );
    this.add(this.retryButton);
    this.retryButton.addListener("click");
    this.retryButton.on("click", () => {
      game.clear();
      this.mode = 1;
    });

    game.add.existing(this);
  }
  preUpdate() {
    if (this.mode === 0) {
      this.shadow.setVisible(true);
      this.startText.setVisible(true);
      this.scoreText.setVisible(false);
      this.retryButton.setVisible(false);
    } else if (this.mode === 1) {
      this.shadow.setVisible(false);
      this.startText.setVisible(false);
      this.scoreText.setVisible(false);
      this.retryButton.setVisible(false);
    } else if (this.mode === 2) {
      this.shadow.setVisible(false);
      this.startText.setVisible(false);
      this.scoreText.setVisible(true);
      this.scoreText.setText(`スコア : ${Math.floor(this.game.score)}`);
      this.retryButton.setVisible(true);
    }
  }
}
