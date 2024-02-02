import { game } from "../game";

export default class goal extends Phaser.GameObjects.Container {
  game: game;
  type: "red" | "blue";

  constructor(game: game, x: number, y: number, type: "red" | "blue") {
    super(game, x, y);
    this.setAngle(type === "red" ? 0 : 180);
    this.game = game;
    this.type = type;

    const goalImage = game.add.image(0, 0, "goal").setScale(1);
    this.add(goalImage);

    const rect1 = game.matter.add.rectangle(this.x, this.y - 75, 64, 10);
    rect1.isStatic = true;
    const rect2 = game.matter.add.rectangle(this.x, this.y + 75, 64, 10);
    rect2.isStatic = true;
    const rect3 = game.matter.add.rectangle(
      this.x + (this.type == "red" ? -30 : 30),
      this.y,
      10,
      160
    );
    rect3.isStatic = true;

    game.add.existing(this);
  }
  preUpdate() {
    if (!this.game.ball) return;
    if (this.game.isCoolDown) return;
    const ballPosition = [this.game.ball.x, this.game.ball.y];
    const rectEdge = {
      x: [-25 - 25 + this.x, 25 + 25 + this.x],
      y: [-73 - 25 + this.y, 73 + 25 + this.y],
    };
    if (
      rectEdge.x[0] < ballPosition[0] &&
      rectEdge.x[1] > ballPosition[0] &&
      rectEdge.y[0] < ballPosition[1] &&
      rectEdge.y[1] > ballPosition[1]
    ) {
      this.game.isCoolDown = true;
      this.game.point[this.type === "blue" ? "red" : "blue"] += 1;
      this.game.cheer?.play();
      this.game.goalAnimaiton?.play();
      if (this.game.point.blue >= 5 || this.game.point.red >= 5)
        this.game.gameEnd();
      else
        setTimeout(() => {
          this.game.ball?.setPosition(400, 300);
          this.game.ball?.setVelocity(0, 0);
          this.game.player?.red.reset();
          this.game.player?.blue?.reset();
          this.game.isCoolDown = false;
        }, 1000);
    }
  }
}
