import { game } from "../game";

export default class ui extends Phaser.GameObjects.Container {
  constructor(game: game) {
    super(game, 400, 556);

    const blackScreen = game.add.rectangle(0, 0, 800, 88, 0x000000);
    this.add(blackScreen);

    //UIのボタン
    for (let i = 1; i <= 5; i++) {
      const newButton = game.add.dom(
        -420 + 140 * i,
        0,
        "button",
        {
          color: "white",
          backgroundColor: "black",
          outline: "none",
          border: "solid 2px gray",
          borderRadius: "5px",
          width: "120px",
          height: "50px",
        },
        i.toString()
      );
      newButton.addListener("click");
      newButton.on("click", () => {
        game.getPlayer()?.addForce(-i * 68 - 280);
      });
      this.add(newButton);
    }

    game.add.existing(this);
  }
}
