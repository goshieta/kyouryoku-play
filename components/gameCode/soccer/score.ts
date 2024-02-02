export class score extends Phaser.Scene {
  scoreInfo: {
    blue: number;
    red: number;
  } = { blue: 0, red: 0 };
  end: boolean = false;

  constructor() {
    super("score");
  }
  init(info: {
    scoreInfo: {
      blue: number;
      red: number;
    };
  }) {
    this.scoreInfo = info.scoreInfo;
    this.end = false;
  }
  create() {
    this.end = false;
    const scoreText = this.add
      .text(400, 300, `${this.scoreInfo.red} - ${this.scoreInfo.blue}`, {
        fontSize: 70,
        fontStyle: "bold",
      })
      .setFill("black")
      .setOrigin(0.5, 0.5);
    const resultText = this.add
      .text(
        400,
        200,
        `${this.scoreInfo.red > this.scoreInfo.blue ? "Red" : "Blue"} win!`,
        { fontSize: 70, fontStyle: "bold" }
      )
      .setFill(this.scoreInfo.red > this.scoreInfo.blue ? "red" : "blue")
      .setOrigin(0.5, 0.5);
    const topButton = this.add.dom(
      400,
      400,
      "button",
      {
        color: "white",
        backgroundColor: "black",
        border: "none",
        borderRadius: "5px",
        width: "150px",
        height: "50px",
        outline: "none",
      },
      "トップ"
    );
    topButton.addListener("click");
    const scoreScreenGroup = this.add.container(0, -400, [
      scoreText,
      resultText,
      topButton,
    ]);
    topButton.on("click", () => {
      this.tweens.add({
        targets: scoreScreenGroup,
        y: 600,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          this.end = true;
        },
      });
    });
    this.tweens.add({
      targets: scoreScreenGroup,
      y: 0,
      duration: 1000,
      ease: "Power2",
    });
  }
}
