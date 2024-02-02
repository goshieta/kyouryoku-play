import { game } from "../game";

export default class player extends Phaser.Physics.Matter.Sprite {
  game: game;
  type: "red" | "blue";
  setting: {
    x: number;
    y: number;
    type: "red" | "blue";
  };
  constructor(
    game: game,
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    type: "red" | "blue"
  ) {
    super(world, x, y, type);
    this.type = type;
    this.game = game;
    this.setting = {
      x: x,
      y: y,
      type: type,
    };

    this.setScale(0.7);
    this.setAngle(type == "blue" ? 270 : 90);
    this.setFriction(1, 0.1);

    game.add.existing(this);
  }

  protected preUpdate(time: number, delta: number): void {
    if (this.game.mode === 0) return;
    if (this.game.isCoolDown) return;
    const speed = 15;
    const radians = (this.angle - 90) * (Math.PI / 180);
    if (this.game.spriteMove[this.type])
      this.setVelocity(speed * Math.cos(radians), speed * Math.sin(radians));
    else this.angle += this.type == "blue" ? 1.5 : -1.5;
  }

  reset() {
    this.setVelocity(0, 0);
    this.setAngle(this.setting.type == "blue" ? 270 : 90);
    this.setPosition(this.setting.x, this.setting.y);
  }
}
