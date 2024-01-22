import { game } from "../game";

export default class item extends Phaser.GameObjects.Container {
  itemName: string;
  mainSprite: Phaser.Physics.Arcade.Sprite;
  light: Phaser.GameObjects.PointLight;
  backcircle: Phaser.GameObjects.Arc;
  spriteContainer: Phaser.GameObjects.Container;

  interactiveStopper: boolean = true;

  game: game;

  constructor(game: game, x: number, y: number, itemName: string) {
    super(game, x, y);
    this.itemName = itemName;
    this.game = game;

    this.setDepth(-1);

    //ライト
    this.light = game.add.pointlight(0, 0, 0xf7ff00, 70, 0.3, 0.07);
    this.add(this.light);

    //円
    this.backcircle = game.add.circle(0, 0, 20, 0xf7ff00);

    //スプライト
    this.mainSprite = game.physics.add.sprite(0, 0, this.itemName);
    this.mainSprite.setScale(0.4, 0.4);

    this.spriteContainer = game.add.container(0, 0, [
      this.backcircle,
      this.mainSprite,
    ]);
    this.spriteContainer.setScale(0.1);
    this.add(this.spriteContainer);

    game.add.existing(this);
    game.tweens.add({
      targets: this.spriteContainer,
      ease: "Power1",
      duration: 500,
      scale: 1,
      onComplete: () => {
        this.interactiveStopper = false;
      },
    });
  }

  preUpdate() {
    if (this.interactiveStopper) this.mainSprite.disableBody(true, false);
    else this.game.physics.add.existing(this.mainSprite);
  }

  touched() {
    this.interactiveStopper = true;
    this.game.tweens.add({
      targets: this.spriteContainer,
      ease: "Power1",
      duration: 500,
      scale: 0,
    });
    this.game.tweens.add({
      targets: this.light,
      ease: "Power1",
      duration: 500,
      attenuation: 0.01,
    });
    setTimeout(() => {
      this.destroy();
    }, 500);
  }
}
