import { game } from "../game";

export default class sprite extends Phaser.Physics.Arcade.Sprite {
  isFloating: boolean = true;
  setIsFloating = (newVal: boolean) => (this.isFloating = newVal);
  game: game;

  constructor(game: game) {
    super(game, 80, 100, "player", 0);
    this.game = game;
    this.setScale(2);
    this.anims.create({
      key: "playerRun",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.play("playerRun");

    game.add.existing(this);
    game.physics.world.enable(this);

    game.input.keyboard?.on("keyup", (index: any) => {
      if (
        index.key == "1" ||
        index.key == "2" ||
        index.key == "3" ||
        index.key == "4" ||
        index.key == "5"
      ) {
        const keyNumber = Number(index.key);
        this.addForce(-keyNumber * 68 - 280);
      }
    });
  }

  addForce(forceScale: number) {
    if (this.isFloating) return;
    this.game.sound.play("jump");
    this.setIsFloating(true);
    this.setVelocityY(forceScale);
  }
}
