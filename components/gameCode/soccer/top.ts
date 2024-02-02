export class top extends Phaser.Scene {
  play: 0 | 1 | 2 = 0;

  constructor() {
    super("top");
  }
  create() {
    this.play = 0;
    const buttonStyle = {
      border: "none",
      width: "200px",
      height: "150px",
      fontSize: "35px",
      fontWeight: "bold",
      backgroundColor: "#000000",
      color: "white",
      outline: "none",
    };
    const oneButton = this.add.dom(250, -75, "button", buttonStyle, "1P");
    const twoButton = this.add.dom(550, -75, "button", buttonStyle, "2P");

    const tweenConfig = { y: 300, duration: 500, ease: "Bounce" };
    this.tweens.add({
      targets: oneButton,
      ...tweenConfig,
    });
    this.tweens.add({
      targets: twoButton,
      ...tweenConfig,
    });

    const tweenConfigRemove = { y: -100, duration: 500, ease: "Cubic" };
    const removeTween = (targetNum: 0 | 1 | 2) => {
      this.tweens.add({
        targets: oneButton,
        ...tweenConfigRemove,
      });
      this.tweens.add({
        targets: twoButton,
        ...tweenConfigRemove,
        onComplete: () => {
          this.play = targetNum;
        },
      });
    };
    oneButton.addListener("click");
    twoButton.addListener("click");
    oneButton.on("click", () => {
      removeTween(1);
    });
    twoButton.on("click", () => {
      removeTween(2);
    });
  }
}
