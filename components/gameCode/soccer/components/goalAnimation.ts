import { game } from "../game";

//ゴールを決めたときの紙吹雪のアニメーション
export default class goalAnimation extends Phaser.GameObjects.Container {
  animationObject: [Phaser.GameObjects.Rectangle, number][] = [];
  game: game;

  constructor(game: game) {
    super(game, 400, 0);
    this.game = game;

    this.game.add.existing(this);
  }

  preUpdate() {
    this.animationObject = this.animationObject.filter((oneRect) => {
      oneRect[0].setX(Math.sin(oneRect[1]) * 3 + oneRect[0].x);
      oneRect[1] += 0.05;
      if (oneRect[0].y >= 620) return false;
      return true;
    });
  }

  play() {
    //アニメーションを再生
    for (let i = 0; i < 100; i++) {
      const colorArray = [
        0x00ff44, 0x00a6ff, 0xc300ff, 0xc300ff, 0xff0000, 0xffee00, 0xffee00,
      ];
      const x = Math.floor(Math.random() * 700) - 350;
      const newRect = this.game.add.rectangle(
        x,
        -20,
        15,
        15,
        colorArray[Math.floor(Math.random() * colorArray.length)]
      );
      this.add(newRect);
      this.game.tweens.add({
        targets: newRect,
        y: 620,
        ease: "Linear",
        duration: 3000,
        delay: Math.random() * 3000,
        onComplete: () => newRect.destroy(),
      });
      this.animationObject.push([newRect, Math.random() * 3]);
    }
  }
}
